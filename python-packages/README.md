# Python package placeholder

이 저장소의 Python 패키지는 `python-packages/*` 아래에 둘 계획이다.

현재는 실제 패키지가 없으므로 Python release workflow를 두지 않는다. scaffold-only workflow는 모든 job이 skip되는 GitHub Actions 실패 알림을 만들 수 있어 사용하지 않는다.

첫 Python 패키지를 추가할 때 해야 할 일:

1. `python-packages/<package-name>/pyproject.toml` 생성
2. release-please를 쓸지, 단순 tag 기반 publish를 쓸지 결정
3. PyPI trusted publishing 설정
4. 실제 build + `pypa/gh-action-pypi-publish` publish job 추가

주의:

- 실제 패키지가 생기기 전에는 `.github/workflows/release-python.yml`을 추가하지 않는다.
- PyPI trusted publishing은 top-level workflow job 기준으로 구성한다.
