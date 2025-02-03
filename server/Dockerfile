FROM node:18-slim

# Install Python and C++ compilers
RUN apt-get update && \
        apt-get install -y \
        python3 \
        g++ \
        build-essential \
        && rm -rf /var/lib/apt/lists/*

# Set execution limits
RUN echo "* soft nproc 50" >> /etc/security/limits.conf && \
        echo "* hard nproc 50" >> /etc/security/limits.conf && \
        echo "* soft nofile 1024" >> /etc/security/limits.conf && \
        echo "* hard nofile 1024" >> /etc/security/limits.conf

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run","dev"]