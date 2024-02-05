################################
# Project Configuration Makefile
#
# setup
# - Initialize the project for development.
# - Calls './dev/setup.sh'.
#
# validate
# - Validate the project against static analysis.
# - Calls './dev/validate.sh'.
#
# build-dev
# - Compile the project for localized usage.
# - Calls './dev/build-dev.sh'.
#
# build-production
# - Compile the project for production or public usage.
# - Calls './dev/build-production.sh'.
#
################################

setup:
	@echo "Task: 'setup'"
	@mkdir -p "dev"
	@touch ./dev/setup.sh
	@chmod +x ./dev/setup.sh
	sh ./dev/setup.sh

validate:
	@echo "Task: 'validate'"
	@mkdir -p "dev"
	@touch ./dev/validate.sh
	@chmod +x ./dev/validate.sh
	sh ./dev/validate.sh

build:
	@echo "Task: 'build'"
	@mkdir -p "dev"
	@touch ./dev/build.sh
	@chmod +x ./dev/build.sh
	sh ./dev/build.sh
	make validate
