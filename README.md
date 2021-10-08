# telecharge-moi-un-pdf



## Trigger manualy the cloud function 

1. Start the cloud function 
`npm run start:cloud-function`

2. Post the data
```sh
curl -d "@mockPubsub.json" \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost:8080
```