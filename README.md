# Michal's ML Engineer Portfolio

A modern, animated portfolio website for showcasing machine learning engineering skills and projects.

## Features

- Responsive design that works on all devices
- Smooth animations using Framer Motion
- Dark mode support
- Sections for showcasing skills, projects, and contact information
- Easy deployment to GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Customization

### Personal Information

Update the following files to customize the portfolio:

- `app/components/Hero.tsx` - Update your name and introduction
- `app/components/About.tsx` - Modify your about information
- `app/components/Skills.tsx` - Adjust your skills and proficiency levels
- `app/components/Projects.tsx` - Add your own projects with descriptions and links
- `app/components/Contact.tsx` - Update your contact information and social links

### Images

Replace the placeholder images in the `public` directory with your own:

- `profile-placeholder.jpg` - Your profile photo
- `project-placeholder-1.jpg`, etc. - Your project images

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository.

2. Run the deploy script:
```bash
npm run deploy
# or
yarn deploy
```

3. Go to your repository settings on GitHub, navigate to "Pages" and set the source to the "gh-pages" branch.

4. Your portfolio will be available at `https://yourusername.github.io/repository-name/`.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library
- [Heroicons](https://heroicons.com/) - Beautiful SVG icons

## License

This project is licensed under the MIT License.
