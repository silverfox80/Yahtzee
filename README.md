# . ./run.sh x.x.x
```
set -e  # Exit on error
if [[ $# -eq 0 ]] ; then
    echo 'You need to provide the version'
    exit 0
fi

VERSION=$1
cd Yahtzee

echo "Fetching latest code..."
git fetch origin
git pull origin

echo "Building Docker image..."
docker buildx build --network=host -t "yahtzee:$VERSION" --load .

echo "Stopping and removing old container..."
docker stop yahtzee || true
if docker ps -a --format '{{.Names}}' | grep -q '^yahtzee$'; then
  docker rm -f yahtzee
  echo "Old container removed."
fi
echo "####################################"
echo "Create new container with version $1"
echo "####################################"
docker run  -d --rm --name yahtzee -p 48071:3000 yahtzee:$1
```
