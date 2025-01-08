# Containerization
### . ./run.sh {version}

```bash
if [[ $# -eq 0 ]] ; then
    echo 'You need to provide the version'
    exit 0
fi
cd Yahtzee
git fetch origin
git pull origin
docker build -t "yahtzee:$1" .
echo "Stop and remove old container"
docker stop yahtzee
docker rm yahtzee
echo "####################################"
echo "Create new container with version $1"
echo "####################################"
docker run  -d --name yahtzee -p {EXT_PORT}:3000 yahtzee:$1
