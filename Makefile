SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

.DEFAULT_GOAL := help

ASSETS_DIR := themes/staticfy/assets

.PHONY: help
help: ## Show this help message
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' Makefile

.PHONY: setup
setup:	## Install dependencies
	yarn install

.PHONY: theme
theme: theme-images theme-scripts theme-css	## Build the theme

.PHONY: theme-images
theme-images: $(wildcard src/images/*) $(wildcard node_modules/leaflet/dist/images/*.png)	## Build theme images
	cp $? $(ASSETS_DIR)/images/

.PHONY: theme-scripts
theme-scripts: node_modules/leaflet/dist/leaflet.js*	## Build theme scripts
	cp $? $(ASSETS_DIR)/js/

.PHONY: theme-styles	
theme-styles: $(wildcard node_modules/leaflet/dist/*.css)
	cp $? $(ASSETS_DIR)/css/

.PHONY: theme-css
theme-css: theme-styles tailwind.config.js src/css/tailwind.css		## Build theme styles
	npx tailwindcss --input src/css/tailwind.css --output $(ASSETS_DIR)/css/tailwind.css

BUILD_TARGETS := theme

.PHONY: build
build: $(BUILD_TARGETS) ## Build everything
