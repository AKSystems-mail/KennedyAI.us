#!/bin/bash
cd /home/hermes_agent/KennedyAI.us/portfolio-website2
npx vite --host 0.0.0.0 --port 5173 > /tmp/vite-log.txt 2>&1
