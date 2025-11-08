# ShiftSmart-Manager9

## Development (run separately)
### Backend
```
cd backend
npm install
npm start
```

### Frontend
```
cd frontend
npm install
npm run dev
```
Access at http://localhost:5173

---

## Production (Docker single container)
```
docker compose up --build
```
or manually:
```
docker build -t shiftsmart-backend .
docker run -p 4000:4000 -v $(pwd)/backend/data:/app/data shiftsmart-backend
```
Frontend will be served on http://localhost:4000
