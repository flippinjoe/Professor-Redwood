
dev:
	docker-compose up --build --abort-on-container-exit

publish:
	cd ./machine && ./publish.sh
