FROM node:18

RUN corepack prepare pnpm@latest --activate
RUN corepack enable

ADD src src
ADD package.json package.json
ADD pnpm-lock.yaml pnpm-lock.yaml
ADD tsconfig.json tsconfig.json

RUN pnpm i
RUN pnpm build

CMD pnpm start
