# Changelog

## Unreleased
- Fixed a bug where event name is not returned properly

## v1.2.2
- Fixed wrong regex expression for string replacement

## v1.2.1
- Cleaned up `async/await` code blocks
- Added missing emoji to the latest events

## v1.2.0
- Added emoji to beautify some text
- Added a quicker command to retrieve prices of coins
- Added calculation for ETH pairing

## v1.1.1
- Added reply for coins that are not found
- Removed user-agent spoof since upstream API have changed and is now working without it
- Removed BTC pairing for the price of Bitcoin (BTC) since it will always be 1.0 
- Added link to the page of the respective coin for the price related commands

## v1.1.0
- Fixed events not working because of upstream API changes

## v1.0.4
- Added `/start` and `/help` command helper

## v1.0.3
- Fixed an error where the bot crashed while querying the event of a coin

## v1.0.2
- Added Bitcoin dominance to market cap command
- Fixed command for retrieving total market cap
- Fixed bot not doing anything when a lowercase coin symbol is being entered

## v1.0.1
- Fixed coin prices not showing for certain coins
- Fixed events crashing by dynamically setting the version to spoof the user-agent

## v1.0.0
Initial release of the Crypto Helper Telegram bot

### Features:
- List 3 most recent events
- List events for a particular coin
- List the price of a particular coin in USD, BTC and ETH
- List the current total market capitalisation for crypto currencies