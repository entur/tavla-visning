import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	overwrite: true,
	schema: './graphql-tools/schema.json',
	documents: 'src/**/*.graphql',
	hooks: { afterAllFileWrite: ['pnpm exec biome format --write ./src'] },
	config: {
		typesPrefix: 'T',
		documentMode: 'string',
		documentVariableSuffix: 'Query',
		fragmentVariableSuffix: 'Fragment',
		skipTypeName: true,
		enumsAsTypes: true,
		useTypeImports: true,
		scalars: {
			Coordinates: 'Coordinates',
			Date: 'Date',
			DateTime: 'DateTime',
			Duration: 'Duration',
			LocalTime: 'LocalTime',
			Time: 'Time',
			Long: 'Long',
			DoubleFunction: 'DoubleFunction',
		},
		avoidOptionals: {
			field: true,
		},
	},
	generates: {
		'src/types/graphql-schema.ts': {
			plugins: [
				'typescript',
				{
					add: {
						content: '// @ts-nocheck',
					},
				},
			],
		},
		'src/graphql/index.ts': {
			preset: 'import-types',
			presetConfig: {
				typesPath: 'src/types/graphql-schema',
			},
			plugins: [
				'typescript-operations',
				'typed-document-node',
				{
					add: {
						content: '// @ts-nocheck',
					},
				},
			],
			config: { withHooks: true },
		},
	},
}

export default config
