# Use the official Deno image
FROM denoland/deno:2.2.11@sha256:d7375240bf886d994996dd2d41d4fedaf9e01e8d35eb6dcba88d9dced8d72050

WORKDIR /app

COPY backend/ ./backend/
COPY website/ ./website/
COPY deno.json .
COPY deno.lock .

RUN chown -R deno:deno /app

USER deno

EXPOSE 8000

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "backend/app.ts"]