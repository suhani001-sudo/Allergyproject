import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * MCP Server Configuration for Allergy Management System
 * Provides tools for AI to interact with allergy data
 */
export class AllergyMCPServer {
  constructor(allergyController) {
    this.allergyController = allergyController;
    this.server = new Server(
      {
        name: 'allergy-management-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_allergies',
          description: 'Search for allergies by name, severity, or symptoms',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for allergies',
              },
              severity: {
                type: 'string',
                enum: ['mild', 'moderate', 'severe'],
                description: 'Filter by severity level',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_allergy_info',
          description: 'Get detailed information about a specific allergy',
          inputSchema: {
            type: 'object',
            properties: {
              allergyId: {
                type: 'string',
                description: 'The ID of the allergy to retrieve',
              },
            },
            required: ['allergyId'],
          },
        },
        {
          name: 'analyze_symptoms',
          description: 'Analyze symptoms and suggest possible allergies',
          inputSchema: {
            type: 'object',
            properties: {
              symptoms: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of symptoms to analyze',
              },
            },
            required: ['symptoms'],
          },
        },
        {
          name: 'get_treatment_recommendations',
          description: 'Get treatment recommendations for specific allergies',
          inputSchema: {
            type: 'object',
            properties: {
              allergyName: {
                type: 'string',
                description: 'Name of the allergy',
              },
              severity: {
                type: 'string',
                enum: ['mild', 'moderate', 'severe'],
                description: 'Severity of the allergy',
              },
            },
            required: ['allergyName'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_allergies':
            return await this.handleSearchAllergies(args);
          case 'get_allergy_info':
            return await this.handleGetAllergyInfo(args);
          case 'analyze_symptoms':
            return await this.handleAnalyzeSymptoms(args);
          case 'get_treatment_recommendations':
            return await this.handleGetTreatmentRecommendations(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async handleSearchAllergies(args) {
    // This would integrate with your allergy database
    const results = {
      query: args.query,
      severity: args.severity,
      results: [
        // Placeholder - integrate with actual database
        {
          id: '1',
          name: args.query,
          severity: args.severity || 'moderate',
          symptoms: ['itching', 'rash', 'swelling'],
        },
      ],
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  async handleGetAllergyInfo(args) {
    const info = {
      id: args.allergyId,
      name: 'Sample Allergy',
      description: 'Detailed allergy information',
      symptoms: ['symptom1', 'symptom2'],
      treatments: ['treatment1', 'treatment2'],
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(info, null, 2),
        },
      ],
    };
  }

  async handleAnalyzeSymptoms(args) {
    const analysis = {
      symptoms: args.symptoms,
      possibleAllergies: [
        {
          name: 'Possible Allergy 1',
          confidence: 0.85,
          matchingSymptoms: args.symptoms.slice(0, 2),
        },
      ],
      recommendations: [
        'Consult with an allergist',
        'Keep a symptom diary',
        'Avoid potential triggers',
      ],
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  async handleGetTreatmentRecommendations(args) {
    const recommendations = {
      allergyName: args.allergyName,
      severity: args.severity,
      treatments: [
        {
          type: 'medication',
          name: 'Antihistamines',
          dosage: 'As prescribed',
        },
        {
          type: 'lifestyle',
          name: 'Avoidance',
          description: 'Avoid known triggers',
        },
      ],
      emergencySteps: [
        'Use EpiPen if prescribed',
        'Call emergency services',
        'Seek immediate medical attention',
      ],
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(recommendations, null, 2),
        },
      ],
    };
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('MCP Server started successfully');
  }
}

export default AllergyMCPServer;
