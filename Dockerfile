# build environment

FROM node:20-alpine as svelte
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
ARG GIT_COMMIT
ARG GIT_BRANCH
COPY . .
RUN echo "{\"commit\": \"${GIT_COMMIT}\", \"branch\": \"${GIT_BRANCH}\"}" > static/git-info.json
RUN yarn build


FROM node:20-alpine as backend
WORKDIR /app

COPY ./backend/package.json ./
COPY ./backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY ./backend .
RUN yarn build

# production environment
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend /app/ ./
COPY --from=backend /app/yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY --from=svelte /app/build ./svelte-build
EXPOSE 2000
CMD node ./comp/backend.js