import { AlertTriangle, Boxes, PackageX, Package } from "lucide-react";

import { InventoryMovementsTable } from "@/components/admin/inventory/inventory-movements-table";
import {
  InventoryTable,
  type InventoryRow,
} from "@/components/admin/inventory/inventory-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

function stockStatusFor(
  stock: number,
  threshold: number,
): InventoryRow["stockStatus"] {
  if (stock === 0) return "OUT_OF_STOCK";
  if (stock <= threshold) return "LOW_STOCK";
  return "IN_STOCK";
}

export default async function AdminInventoryPage() {
  await requireRole("MANAGER");

  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      orderBy: { stock: "asc" },
      include: { category: { select: { name: true } } },
    }),
    prisma.inventoryMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        product: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
    }),
  ]);

  const inventoryRows: InventoryRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryName: product.category?.name ?? null,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    stockStatus: stockStatusFor(product.stock, product.lowStockThreshold),
  }));

  const movementRows = movements.map((movement) => ({
    id: movement.id,
    productName: movement.product.name,
    type: movement.type,
    quantity: movement.quantity,
    note: movement.note,
    actorName: movement.createdBy?.name ?? null,
    createdAt: movement.createdAt.toISOString(),
  }));

  const outOfStockCount = inventoryRows.filter(
    (row) => row.stockStatus === "OUT_OF_STOCK",
  ).length;
  const lowStockCount = inventoryRows.filter(
    (row) => row.stockStatus === "LOW_STOCK",
  ).length;
  const totalUnits = inventoryRows.reduce((sum, row) => sum + row.stock, 0);

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock levels and the movement ledger behind them."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total products"
          value={inventoryRows.length.toLocaleString()}
          icon={Package}
        />
        <StatCard
          label="Total units in stock"
          value={totalUnits.toLocaleString()}
          icon={Boxes}
        />
        <StatCard
          label="Low stock"
          value={lowStockCount.toLocaleString()}
          icon={AlertTriangle}
        />
        <StatCard
          label="Out of stock"
          value={outOfStockCount.toLocaleString()}
          icon={PackageX}
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-heading-03 text-content-primary">
          Stock levels
        </h2>
        <InventoryTable products={inventoryRows} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-heading-03 text-content-primary">
          Recent movements
        </h2>
        <InventoryMovementsTable movements={movementRows} />
      </div>
    </div>
  );
}
