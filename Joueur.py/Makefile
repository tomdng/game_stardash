all:
	make dependencies
	make core

dependencies:
	pip3.7 install -U -r requirements.txt

core:
	python3.7 -m compileall -x '_creer' ./

clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -delete

