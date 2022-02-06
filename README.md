## Description
Some tools provide secure and usable ERC20 contracts through inheritance for us to include such as openzeppelin, and it is recommended to use them for security purposes. This project is my own attempt of implementing the ins and outs of an ERC20 token without the use of external libraries.

## OS
- macOS Monterey

## App environment
- Ganache
- Metamask extension

## Programming environment
- NodeJS
- Solidity
- truffle

## Migrate
- ``truffle migrate --reset``
## Test
- ``truffle test``

## Notes

- In my code, I use a lot of require statements which is expensive in terms of gas, they can easily be merged into one statement.
- I did not really focus on the webpage design and esthetics as it is not really the point of the exercise, it is a very basic webpage that lets you interact with the smart contracts.
