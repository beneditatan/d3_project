import json

with open("C:\wamp_3\www\d3_project\campaign_performance\DS003a_Adwords_AdPerformance_modified.json", "w") as f:
    inf = open("C:\wamp_3\www\d3_project\campaign_performance\DS003a_Adwords_AdPerformance.json", "r")
    data = json.load(inf)
    for i in range(0, len(data)):
        data[i]['Campaign'] = "Campaign " + str(i+1)
    json.dump(data, f, indent=4)
