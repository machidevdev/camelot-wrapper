import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { connect } from './connection';
import { poolModel } from "./schemas/poolSchema";
import { syncData } from './utils/sync';
import { responseBuilder } from './utils/response';
import { isAddress } from 'viem'
import { sendMessage } from './utils/discord';



export const pools = async (): Promise<APIGatewayProxyResult> => {
  const { connection } = await connect();

  if (connection.readyState === 1) {
    try {
      const pools = await poolModel.find({})
      return responseBuilder({
        statusCode: 200,
        data: pools,
      });
    }
    catch (error) {
      return responseBuilder({
        statusCode: 500,
        data: JSON.stringify({ error }),
      });
    }

  }
  return responseBuilder({
    statusCode: 500,
    data: JSON.stringify({ error: 'Internal Server Error' }),
  });
}


export const getPoolByAddress = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { connection } = await connect();
    if (connection.readyState === 1) {
      // Ensure pathParameters is not null
      const pathParameters = event.pathParameters || {};

      // Extract the address from the pathParameters
      const { address } = pathParameters;

      if (isAddress(address!) === false) return responseBuilder({
        statusCode: 400,
        data: JSON.stringify({ error: 'Invalid address' }),
      })
      else {
        const poolByAddress = await poolModel.findOne({ address: address })
        return responseBuilder({
          statusCode: 200,
          data: poolByAddress,
        })
      }


    } else {
      return responseBuilder({
        statusCode: 500,
        data: JSON.stringify({ error: 'Internal Server Error' }),
      })
    }
  } catch (error) {
    return responseBuilder({
      statusCode: 500,
      data: JSON.stringify({ error }),
    })
  }
};


export const search = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  await connect();
  try {
    const requestBody = JSON.parse(event.body || '{}');

    if (!requestBody.search) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing or invalid "search" property in the request body' }),
      };
    }
    const searchQuery = requestBody.search;
    const filteredPools = await poolModel.find({ name: { $regex: searchQuery, $options: 'i' } });

    return responseBuilder({
      statusCode: 200,
      data: filteredPools,
    })
  } catch (error) {
    return responseBuilder({
      statusCode: 500,
      data: JSON.stringify({ error }),
    })
  }
};







//this one has to be called every 5 minutes or so from cloudwatch
export const sync = async (): Promise<void> => {
  try {
    await syncData();
   sendMessage("Server", "sync", "Processing completed successfully.");

  }
  catch (error) { 
    console.error(error);
    sendMessage("Server", "sync", "Processing error:" + error);

  }
}







