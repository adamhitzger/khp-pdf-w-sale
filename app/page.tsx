import { SaleTool } from "@/components/sale-tool";

/**
 * Konfigurátor tady běží bez galerií realizací — nástroj slouží k přepočtu už
 * hotové poptávky, ne k prodeji, takže fotky produktů ze Sanity (PRODUCT_PHOTOS_QUERY)
 * nemá smysl tahat. Ilustrační fotky do samotné nabídky se načítají až při odeslání
 * v `sendConfWithSale`.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SaleTool />
    </main>
  );
}
