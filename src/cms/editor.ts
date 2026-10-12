import { EXPERIMENTAL_TableFeature, type FeatureProviderServer } from '@payloadcms/richtext-lexical'

// Default Lexical features + tables (several posts use GFM tables). Shared by
// the editor and the markdown export so both understand the same nodes.
export const editorFeatures = ({
  defaultFeatures,
}: {
  defaultFeatures: FeatureProviderServer[]
}): FeatureProviderServer[] => [...defaultFeatures, EXPERIMENTAL_TableFeature()]
