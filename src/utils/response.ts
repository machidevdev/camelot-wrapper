

interface ResponseBuilderOptions<T> {
    statusCode?: number;
    data: T | null
}

function responseBuilder<T>(options: ResponseBuilderOptions<T>) {
    const { statusCode = 200, data } = options;

    let body: string;
    if (data === null || data === undefined) {
        body = ''; // Set to an empty string if data is null or undefined
    } else if (typeof data === 'string') {
        body = data;
    } else {
        body = JSON.stringify(data);
    }

    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*", // Adjust this to allow specific origins
            "Access-Control-Allow-Credentials": true,
            // Add other CORS headers as needed
        },
        body
    }
}


export { responseBuilder, ResponseBuilderOptions }