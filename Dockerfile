# build frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# get deno
FROM denoland/deno:bin AS deno-bin

# run environment
FROM python:3.10-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY --from=deno-bin /deno /usr/local/bin/deno

# install ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy frontend builds to /app/dist
COPY --from=frontend-build /app/frontend/dist ./dist

# create /downloads and set permission
RUN mkdir -p /app/downloads && chmod 777 /app/downloads

COPY backend/ .
RUN uv sync --frozen

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]