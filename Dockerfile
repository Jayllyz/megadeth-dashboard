FROM node:22-alpine AS base
WORKDIR /app

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

# hadolint ignore=DL3018
RUN apk add --no-cache gcompat && \
    corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

FROM base AS dev
ENV NODE_ENV=development

RUN pnpm fetch && \
    pnpm install

COPY --chown=node:node . .

CMD ["node", "--run", "dev"]


FROM base AS builder

RUN pnpm fetch && \
    pnpm install

COPY --chown=node:node . .

RUN pnpm run build && \
    pnpm prune --prod

FROM base AS prod
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown node:node .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER node
CMD ["HOSTNAME=0.0.0.0", "node", "server.js"]
