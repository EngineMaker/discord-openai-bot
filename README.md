# discord-openai-bot


![_em-gpt___EngineMakerβ版_-_Discord](https://user-images.githubusercontent.com/19232182/225725368-e637e485-119e-44ae-8c79-3cd399463cdf.png)

## Set up for development
```sh
pnpm i
```

In separate tabs of the terminal
```
pnpm tsc --watch
```
and
```
pnpm dev
```


## Deploy
GCP Container Registry
```
gcloud builds submit --tag gcr.io/<YOUR PROJECT NAME>/<YOUR IMAGE NAME> .
```