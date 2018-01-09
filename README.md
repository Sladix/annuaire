# Installation

## Prérequis
- PHP 5.6
- Node.js et NPM
- Serveur Mysql/MariaDb

## API (depuis un shell dans ./annuaire-api)
- composer install
- php app/console doctrine:database:create
- php app/console doctrine:schema:update --force
- php app/console server:run

### Configuration BDD
- app/config/parameters.yml

## Front End (depuis un shell dans ./annuaire-front)
- npm install
- npm run start
