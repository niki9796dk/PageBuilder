import * as _ from 'lodash';
import {assert} from './Assert';

export class Validator {
    public static validate(ast: any): void {
        assert(ast.type, 'Type key is required');
        assert(ast.type === 'document', 'Root element must be of type document');

        this.validateSchema(this.getSchema('document'), ast, 'root');
    }

    // TODO: Validate parent child relationship between element types.
    private static validateSchema(schema: any, ast: any, path: string): void {
        // Validate the specific element
        Object.keys(schema).forEach((key: string) => {
            const keySchema = schema[key];

            if (keySchema.required) {
                assert(ast[key] !== undefined, `Key [${key}] is required by "${path}"`);
            }

            // TODO: Assert type
        });

        // Validate any child elements
        Object.keys(schema).forEach((key: string) => {
            const keySchema = schema[key];
            const element = ast[key];

            // If the element does not have child elements, or is not present then continue.
            if (!(keySchema.hasElements && element)) {
                return;
            }

            // Otherwise validate children
            if (Array.isArray(element)) {
                for (const childKey in element) {
                    const child = element[childKey];

                    this.validateSchema(this.getSchema(child.type, child.subType ?? ''), child, `${path}.${key}[${childKey}]`);
                }
            } else {
                this.validateSchema(this.getSchema(element.type, element.subType ?? ''), element, `${path}.${key}`);
            }
        });
    }

    private static getSchema(type: string, subType?: string): object {
        const schemas = this.getFullSchemaSet();

        const baseSchema = schemas['*'] ?? {};
        const typeSchema = schemas[type];

        assert(typeSchema, `No schema defined for type [${type}]`);

        const typeBaseSchema = typeSchema['*'] ?? {};
        const subTypeSchema = typeSchema[subType ?? 'test'] ?? {};

        return _.merge(
            baseSchema,
            typeBaseSchema,
            subTypeSchema,
        );
    }

    /**
     * Returns the full schema set for all types and their subtypes.
     *
     * @private
     */
    private static getFullSchemaSet(): any {
        return {
            '*': {
                type: {
                    required: true,
                    type: 'string',
                },
                subType: {
                    required: false,
                    type: 'string',
                }
            },

            document: {
                '': {
                    version: {
                        required: true,
                        type: 'string',
                    },
                    sections: {
                        required: true,
                        type: 'array',
                        hasElements: true,
                    },
                    style: {
                        required: false,
                        type: 'object',
                    }
                }
            },

            section: {
                '*': {
                    blocks: {
                        required: true,
                        type: 'array',
                        hasElements: true,
                    },
                    grid: {
                        required: true,
                        type: 'object',
                        hasElements: true,
                    },
                    style: {
                        required: false,
                        type: 'object',
                    }
                }
            },

            block: {
                '*': {
                    position: {
                        required: true,
                        type: 'position'
                    },
                    subType: {
                        required: true,
                    },
                    style: {
                        required: false,
                        type: 'object',
                    },
                },

                text: {
                    value: {
                        required: true,
                        type: 'string',
                    }
                },

                image: {
                    src: {
                        required: true,
                        type: 'string',
                    },
                    alt: {
                        required: false,
                        type: 'string',
                    },
                },

                line: {
                    color: {
                        required: false,
                        type: 'string',
                    }
                },

                code: {
                    value: {
                        required: true,
                        type: 'string',
                    }
                },

                quote: {
                    'quote': {
                        required: true,
                        type: 'string',
                    },
                    'author': {
                        required: true,
                        type: 'string',
                    },
                }
            },

            gridSettings: {
                '': {
                    gap: {
                        required: true,
                        type: 'object',
                        hasElements: true,
                    }
                },

                gap: {
                    column: {
                        required: true,
                        type: 'string',
                    },
                    row: {
                        required: true,
                        type: 'string',
                    },
                }
            }
        };
    }
}
