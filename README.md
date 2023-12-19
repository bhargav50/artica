# Uber Ride Analytics Dashboard

A straightforward analytics dashboard for Uber ride data, built with Cube.js and React. Visualize and analyze ride data through various visualizations and gain insights into ride patterns and trends.

## Tech Stack

This project is built using the following technologies:

- [PostgreSQL](https://www.postgresql.org/): An open-source relational database management system known for its reliability and robust features.
- [Docker](https://www.docker.com/): Containerization platform for building, shipping, and running applications.
- [Docker Compose](https://docs.docker.com/compose/): Tool for defining and running multi-container Docker applications.
- [Cube.js](https://cube.dev/): Powering analytical APIs and enabling efficient data analysis.
- [React](https://react.dev/): A declarative, efficient, and flexible JavaScript library for building user interfaces.

### Phases of project

- Build Backend
  - setup docker containers for DB and cube
  - setup initial data load
- Build Frontend
  - create visualizations (stacked bar, pie, heatmap)

P.S. Earlier I was trying to research whether I can create heatmap on actual map for a single city and support zoom-in or zoom-out actions. After some research, I found that geo queries are not supported in Cube, hence dropped the idea :(

### How to start Backend

Location: `./api`

```bash
cd ./api
docker compose up -d
```
### How to start Frontend

Location: `./frontend`

```bash
cd frontend
npm i
npm start
```

### Dataset Used

Uber ride dataset from kaggle is used to generate the visualizations. I have loaded the data via a [python](./api/load_data.py) script.

```bash
  cd ./api
  python load_data.py
```

For simplicity sake, I have added uber.sql dump in the project and loaded in postgres database on startup. By default you will have data for `May 2014` in your database.

## Screenshots

[Dash 1](./docs/Dash1.png)

[Dash 2](./docs/Dash2.png)