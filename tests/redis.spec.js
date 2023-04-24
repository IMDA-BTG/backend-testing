import { Client } from 'redis-om'
import { createClient } from 'redis'
import { test, expect } from '@playwright/test'

const URI = 'redis://localhost:6379'

const task = JSON.stringify({
    "mode":"upload",
    "id":"task:642691211b68cd044de3001e-642691211b68cd044de30023",
    "algorithmId":"algo:aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
    "algorithmArgs":{"sensitive_feature":["Gender","Home_Owner"]},
    "testDataset":"/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing_1.sav",
    "modelFile":"/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan_1_1_1_1.sav",
    "groundTruthDataset":"/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing_1.sav",
    "modelType":"classification",
    "groundTruth":"Interest_Rate"
})

const invalidDatasetTask = JSON.stringify({
    "mode":"upload",
    "id":"task:642691211b68cd044de3001e-642691211b68cd044de30024",
    "algorithmId":"algo:aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
    "algorithmArgs":{"sensitive_feature":["Gender","Home_Owner"]},
    "testDataset":"/home/benflop/uploads/data/combine_all.sh",
    "modelFile":"/home/benflop/uploads/model/pickle_scikit_multiclasslr_loan_1_1_1_1.sav",
    "groundTruthDataset":"/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing_1.sav",
    "modelType":"classification",
    "groundTruth":"Interest_Rate"
})

const invalidModelTask = JSON.stringify({
    "mode":"upload",
    "id":"task:642691211b68cd044de3001e-642691211b68cd044de30023",
    "algorithmId":"algo:aiverify.stock.algorithms.fairness_metrics_toolbox:fairness_metrics_toolbox",
    "algorithmArgs":{"sensitive_feature":["Gender","Home_Owner"]},
    "testDataset":"/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing_1.sav",
    "modelFile":"/home/benflop/uploads/model/combine_all.sh",
    "groundTruthDataset":"/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing_1.sav",
    "modelType":"classification",
    "groundTruth":"Interest_Rate"
})

const validateDataSet = JSON.stringify({
    "serviceId":"service:objectId1234567",
    "filePath":"/home/benflop/uploads/data/pickle_pandas_tabular_loan_testing_1.sav"
})

const validateModel = JSON.stringify({
    "serviceId":"objectId1234567",
    "mode":"upload",
    "modelAccess": {
        "apiSchema":"",
        "apiConfig":"",
        "filePath":"../test-engine-app/test_engine_app/uploads/62cd20d1f4e4650ffcf0e20c/model/pickle_pandas_tabular_compas_testing.sav"
    }
})

const connection = createClient({ URI })

test.beforeEach(async () => {

    // Open API Connection to App via Redis
    await connection.connect()
})

test.skip('Add Test Engine Task with Valid Inputs (Upload)', async () => {
    
    // Open API Connection to App via Redis
    const client = await new Client().use(connection)

    // Register Plugin
    // await connection.hSet('algo:aiverify.algorithms.partial_dependence_plot:partial_dependence_plot', 'inputSchema', hset_command,  requirements "[\"numpy==1.23.5 ; python_version >= \\\"3.10\\\" and python_version < \\\"4.0\\\"\",\"scipy==1.9.3 ; python_version >= \\\"3.10\\\" and python_version < \\\"4.0\\\"\"]" outputSchema "{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"$id\":\"https://gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/partial_dependence_plot/output.schema.json\",\"title\":\"Algorithm Plugin Output Arguments\",\"description\":\"A schema for algorithm plugin output arguments\",\"type\":\"object\",\"required\":[\"feature_names\",\"output_classes\",\"results\"],\"minProperties\":1,\"properties\":{\"feature_names\":{\"type\":\"array\",\"description\":\"Array of feature names\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"output_classes\":{\"type\":\"array\",\"description\":\"Array of output classes\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"results\":{\"description\":\"Matrix of feature values (# feature names)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"description\":\"Matrix of PDP values (# output classes)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"type\":\"array\",\"description\":\"Array of values for each PDP\",\"minItems\":1,\"items\":{\"type\":\"number\"}}}}}}" data "{\"cid\":\"partial_dependence_plot\",\"name\":\"Partial Dependence Plot\",\"modelType\":[\"classification\",\"regression\"],\"version\":\"0.1.0\",\"author\":\"Lionel Teo\",\"description\":\"Partial dependence plot (PDP) depicts the relationship between a small number of input variable and target. They show how predictions partially depend on values of the input variables of interests.\",\"tags\":[\"partial_dependence_plot\",\"Partial Dependence Plot\",\"classification\",\"regression\"],\"requireGroundTruth\":false,\"type\":\"Algorithm\",\"gid\":\"aiverify.algorithms.partial_dependence_plot:partial_dependence_plot\",\"pluginGID\":\"aiverify.algorithms.partial_dependence_plot\",\"algoPath\":\"/home/benflop/GitLab/test-engine-app/test_engine_app/plugins/partial_dependence_plot\"}")

    // Send Task to Task Listener in App via Redis Stream
    const eventId = await connection.xAdd('TestEngineTask', '*' , { task })

    // App returns HSET response via Redis Stream
    const output = await connection.xRange('TestEngineTask', eventId, eventId)

    // Parse HSET Response
    const taskId = JSON.parse(output[0].message.task).id

    // Get HSET Response
    let taskResponse = await connection.hGetAll(taskId)

    while(taskResponse.status != 'Success') {
        taskResponse = await connection.hGetAll(taskId)
    }

    // Assert Response
    expect(taskResponse.status).toBe('Success')

    // Close API Connection
    await client.close()
});

test.skip('Invalid Data File (Upload)', async () => {

    // Open API Connection to App via Redis
    const client = await new Client().use(connection)

    // Register Plugin
    // await connection.hSet('algo:aiverify.algorithms.partial_dependence_plot:partial_dependence_plot', 'inputSchema', hset_command,  requirements "[\"numpy==1.23.5 ; python_version >= \\\"3.10\\\" and python_version < \\\"4.0\\\"\",\"scipy==1.9.3 ; python_version >= \\\"3.10\\\" and python_version < \\\"4.0\\\"\"]" outputSchema "{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"$id\":\"https://gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/partial_dependence_plot/output.schema.json\",\"title\":\"Algorithm Plugin Output Arguments\",\"description\":\"A schema for algorithm plugin output arguments\",\"type\":\"object\",\"required\":[\"feature_names\",\"output_classes\",\"results\"],\"minProperties\":1,\"properties\":{\"feature_names\":{\"type\":\"array\",\"description\":\"Array of feature names\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"output_classes\":{\"type\":\"array\",\"description\":\"Array of output classes\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"results\":{\"description\":\"Matrix of feature values (# feature names)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"description\":\"Matrix of PDP values (# output classes)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"type\":\"array\",\"description\":\"Array of values for each PDP\",\"minItems\":1,\"items\":{\"type\":\"number\"}}}}}}" data "{\"cid\":\"partial_dependence_plot\",\"name\":\"Partial Dependence Plot\",\"modelType\":[\"classification\",\"regression\"],\"version\":\"0.1.0\",\"author\":\"Lionel Teo\",\"description\":\"Partial dependence plot (PDP) depicts the relationship between a small number of input variable and target. They show how predictions partially depend on values of the input variables of interests.\",\"tags\":[\"partial_dependence_plot\",\"Partial Dependence Plot\",\"classification\",\"regression\"],\"requireGroundTruth\":false,\"type\":\"Algorithm\",\"gid\":\"aiverify.algorithms.partial_dependence_plot:partial_dependence_plot\",\"pluginGID\":\"aiverify.algorithms.partial_dependence_plot\",\"algoPath\":\"/home/benflop/GitLab/test-engine-app/test_engine_app/plugins/partial_dependence_plot\"}")

    // Send Task to Task Listener in App via Redis Stream
    const eventId = await connection.xAdd('TestEngineTask', '*' , { invalidDatasetTask })

    // App returns HSET response via Redis Stream
    const output = await connection.xRange('TestEngineTask', eventId, eventId)

    // Parse HSET Response
    const taskId = JSON.parse(output[0].message.invalidDatasetTask).id

    // Get HSET Response
    let taskResponse = await connection.hGetAll(taskId)

    // Assert Response
    console.log(taskResponse) // FIXME Should response be null with Invalid Data File?

    // Close API Connection
    await client.close()
})

test.skip('Invalid Model File (Upload)', async () => {

    // Open API Connection to App via Redis
    const client = await new Client().use(connection)

    // Register Plugin
    // await connection.hSet('algo:aiverify.algorithms.partial_dependence_plot:partial_dependence_plot', 'inputSchema', hset_command,  requirements "[\"numpy==1.23.5 ; python_version >= \\\"3.10\\\" and python_version < \\\"4.0\\\"\",\"scipy==1.9.3 ; python_version >= \\\"3.10\\\" and python_version < \\\"4.0\\\"\"]" outputSchema "{\"$schema\":\"https://json-schema.org/draft/2020-12/schema\",\"$id\":\"https://gitlab.com/imda_dsl/t2po/ai-verify/ai-verify-stock-plugins/partial_dependence_plot/output.schema.json\",\"title\":\"Algorithm Plugin Output Arguments\",\"description\":\"A schema for algorithm plugin output arguments\",\"type\":\"object\",\"required\":[\"feature_names\",\"output_classes\",\"results\"],\"minProperties\":1,\"properties\":{\"feature_names\":{\"type\":\"array\",\"description\":\"Array of feature names\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"output_classes\":{\"type\":\"array\",\"description\":\"Array of output classes\",\"minItems\":1,\"items\":{\"type\":\"string\"}},\"results\":{\"description\":\"Matrix of feature values (# feature names)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"description\":\"Matrix of PDP values (# output classes)\",\"type\":\"array\",\"minItems\":1,\"items\":{\"type\":\"array\",\"description\":\"Array of values for each PDP\",\"minItems\":1,\"items\":{\"type\":\"number\"}}}}}}" data "{\"cid\":\"partial_dependence_plot\",\"name\":\"Partial Dependence Plot\",\"modelType\":[\"classification\",\"regression\"],\"version\":\"0.1.0\",\"author\":\"Lionel Teo\",\"description\":\"Partial dependence plot (PDP) depicts the relationship between a small number of input variable and target. They show how predictions partially depend on values of the input variables of interests.\",\"tags\":[\"partial_dependence_plot\",\"Partial Dependence Plot\",\"classification\",\"regression\"],\"requireGroundTruth\":false,\"type\":\"Algorithm\",\"gid\":\"aiverify.algorithms.partial_dependence_plot:partial_dependence_plot\",\"pluginGID\":\"aiverify.algorithms.partial_dependence_plot\",\"algoPath\":\"/home/benflop/GitLab/test-engine-app/test_engine_app/plugins/partial_dependence_plot\"}")

    // Send Task to Task Listener in App via Redis Stream
    const eventId = await connection.xAdd('TestEngineTask', '*' , { invalidModelTask })

    // App returns HSET response via Redis Stream
    const output = await connection.xRange('TestEngineTask', eventId, eventId)

    // Parse HSET Response
    const taskId = JSON.parse(output[0].message.invalidModelTask).id

    // Get HSET Response
    let taskResponse = await connection.hGetAll(taskId)

    // Assert Response
    console.log(taskResponse) // FIXME No Response with Invalid Data File?

    // Close API Connection
    await client.close()
})

test('Validate Dataset', async () => {

    const client = await new Client().use(connection)

    // Send Task to Task Listener in App via Redis Stream
    const eventId = await connection.xAdd('TestEngineService', '*' , { validateDataSet })

    // App returns HSET response via Redis Stream
    const output = await connection.xRange('TestEngineService', eventId, eventId)

    // Parse HSET Response
    const serviceId = JSON.parse(output[0].message.validateDataSet).serviceId

    // Get HSET Response
    const serviceResponse = await connection.hGetAll(serviceId)

    // Assert Response
    const outputStr = serviceResponse.output
    console.log(serviceResponse)
    // expect(outputStr).toBeEmpty //To change when there is output

    // Close API Connection
    await client.close()
})

test.skip('Validate Model', async () => {

    const client = await new Client().use(connection)

    // Send Task to Task Listener in App via Redis Stream
    const eventId = await connection.xAdd('TestEngineService', '*' , { validateModel })

    // App returns HSET response via Redis Stream
    const output = await connection.xRange('TestEngineService', eventId, eventId)

    // Parse HSET Response
    const serviceId = JSON.parse(output[0].message.validateModel).serviceId

    // Get HSET Response
    const serviceResponse = await connection.hGetAll(serviceId)

    // Assert Response
    const outputStr = serviceResponse.output
    expect(outputStr).toBeEmpty //To change when there is output

    // Close API Connection
    await client.close()
})