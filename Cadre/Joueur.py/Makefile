all:
	make dependencies
	make core

dependencies:
	pip install -U -r requirements.txt

core:
	python -m compileall -x '_creer' ./

clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -delete

