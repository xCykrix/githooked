################################
# Project Configuration Makefile
################################

setup:
	@echo "Task: 'setup'"
	@mkdir -p "dev"
	@touch ./dev/setup.sh
	@chmod +x ./dev/setup.sh
	./dev/setup.sh

validate:
	@echo "Task: 'validate'"
	@mkdir -p "dev"
	@touch ./dev/validate.sh
	@chmod +x ./dev/validate.sh
	./dev/validate.sh

build:
	@echo "Task: 'build'"
	@mkdir -p "dev"
	@touch ./dev/build.sh
	@chmod +x ./dev/build.sh
	./dev/build.sh
	make validate
