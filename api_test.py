from apify_client import ApifyClient
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('INSTRUCTABLES_KEY')
client = ApifyClient(api_key)

# Prepare the Actor input
run_input = {
    "search": "screen printing hoodie sewing machine tie dye",
    "maxItems": 5,
    "extendOutputFunction": "($) => { return {} }",
    "customMapFunction": "(object) => { return {...object} }",
    "proxy": { "useApifyProxy": True },
}

# Run the Actor and wait for it to finish
run = client.actor("epctex/instructables-scraper").call(run_input=run_input)

# Fetch and print Actor results from the run's dataset (if there are any)
print("💾 Check your data here: https://console.apify.com/storage/datasets/" + run["defaultDatasetId"])
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)

# 📚 Want to learn more 📖? Go to → https://docs.apify.com/api/client/python/docs/quick-start