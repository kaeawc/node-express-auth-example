
local:
	mocha test/routes
	mocha test/register
	mocha test/login

all:
	npm install
	make local