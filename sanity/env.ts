export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-13'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// Tenhle nástroj čte ze Sanity jen veřejné fotky do nabídky — token je nepovinný,
// aby appka nespadla na startu, když v .env.local není (na rozdíl od new-konstanta,
// odkud je zbytek souboru zkopírovaný).
export const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
