FROM node:8

# Copy source code
COPY . /src

# Change working directory
WORKDIR /src

# Install dependencies
RUN npm install

# Launch application
CMD ["npm","run", "start.prod"]

# Expose API port to the outside
EXPOSE 3000