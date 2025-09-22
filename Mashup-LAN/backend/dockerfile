# Use official MongoDB image
FROM mongo:7.0

# Set environment variables for the database
ENV MONGO_INITDB_DATABASE=Mashup

# Copy init script to create collection and schema
COPY init.js /docker-entrypoint-initdb.d/