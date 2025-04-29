# SplitAI - Smart Bill Splitting App

SplitAI is a modern web application built with Next.js and TypeScript that solves the problem of splitting bills in complex scenarios, making it easy to handle uneven distribution of items among different people.

## Problem Solved

Splitting items unevenly is complicated and time-consuming. SplitAI makes it easy to handle scenarios like:

- Assigning specific items to particular individuals
- Handling shared items with custom splitting percentages
- Excluding certain participants from specific item categories
- Allowing one person to cover expensive items while others split the rest

## Features

- **Bill Scanning**: Upload a bill photo/scan for AI to extract items and prices
- **Participant Management**: Add and remove people splitting the bill
- **Item Assignment**: Assign each item to one or more participants
- **Smart Calculation**: Automatically calculate what each person owes
- **Payment Support**: Easy sharing of payment summaries

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **UI Components**: Custom components for bill upload, participant management, and item assignment
- **Responsive Design**: Works on mobile and desktop devices

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/split-ai.git
   cd split-ai
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Upload a photo of your bill using the upload area
2. Add participants who will be splitting the bill
3. Assign items to participants by checking the boxes
4. View the payment summary to see what each person owes

## Future Enhancements

- Adjustable percentage share of any assigned item
- Direct integration with payment apps
- Splitwise integration for adding the split to your account
- Receipt history and saved bills
- Custom categories and filters

## License

MIT 