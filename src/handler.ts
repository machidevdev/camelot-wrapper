import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { connect } from './connection';
import { poolModel } from "./schemas/poolSchema";
import { syncData } from './utils/sync';




export const pools = async (): Promise<unknown> => {
  const { connection } = await connect();
  console.log(connection.readyState)



  if (connection.readyState === 1) {
    const pools = await poolModel.find({});
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: pools
      })
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Connection failed"
      })
    }
  }
}


export const getPoolByAddress = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { connection } = await connect();
    if (connection.readyState === 1) {
      console.log("Connection successful")
      // Ensure pathParameters is not null
      const pathParameters = event.pathParameters || {};

      // Extract the address from the pathParameters
      const { address } = pathParameters;
      console.log("address: ", address)

      const poolByAddress = await poolModel.findOne({ address: address })
      console.log("poolByAddress: ", poolByAddress)

      // You can now use the 'address' variable in your code

      return {
        statusCode: 200,
        body: JSON.stringify({ poolByAddress }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error: connection failed '}),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error: ' + error }),
    };
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

    return {
      statusCode: 200,
      body: JSON.stringify({ filteredPools }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};






export const sync = async (): Promise<APIGatewayProxyResult> => {
  await syncData();
  return {
    statusCode: 200,
    body: JSON.stringify("updated"),
  };
}







