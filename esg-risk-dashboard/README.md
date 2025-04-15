# ESG Risk Dashboard

A React-based dashboard for visualizing ESG risk scores and incidents, built with Vite, TypeScript, Redux, D3.js, and Jest.

## Setup Instructions
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Run tests: `npm test`
5. View Storybook: `npm run storybook`
6. Build Storybook: `npm run build-storybook`

## Tech Stack:
- **React + TypeScript**: Type-safe UI components.
- **Redux Toolkit**: Centralized state management.
- **D3.js**: Custom data visualizations. (Also to stick with what the company is using right now)
- **Material-UI (MUI)**: Responsive and accessible UI components.
- **Jest + Testing Library**: Unit and integration testing.
- **Vite**: Fast development/build tooling.
- **Storybook**: Component documentation and isolation

## Component Architecture overview & Key Design Decsion
At this point, I designed for speed of development but ensuring easy scalability in the future. 

I have designed the App.tsx to be the central hub of calling all APIs and the location of handling all the updates. 

All other componenets are meant to be stateless. This way they are simple to maintain. They are also meant to be static componenet where they do not do anything fetching. It will make them easy to test as well. This way also makes it run in isoloation which will be easy to pin down on any bugs. This way also have in the future to do any code spliting and lazy loading. 

This way it Simplifies Storybook integration

API calls and state management. I think we are good at this point but will need to move towards tool like Redux Toolkit or tanstack query for perofmrance and managment benifits. At this moment they are all in one reducers but once we onboard the libaray i menitoned it will be managed by those libaray. 
And if we need to, we can create 1 reducer that is a combine of those data for easy access.


## Folder Structure
src/
├── components/  // All shareable components between other features. For examplem, Button, layout, forms.
├── features/    // Feature speific things, such as company ovewview   
├── store/       // Anything redux related.
├── styles/      // Global styling.
 

## Performance Considerations
- Lazy loading Code splitting: because it can reduce the inital bundle size by 30-50%
- Data Fetching Optmization: Redux Toolkit will be doing alot of caching for us to reduce the needs of refetching or accidentily rerendering/ not rerendering the page.
- React memoization: It can be implmeneted on complex and heavy computing components taht doesn't get render ofthen.  
- On board metric tools: to collect web vitals
- On board alarm tools: to add alarms to notify engineer system is down
- On board testing: Right now there is only unit testing, We can include E2E Testing and smoke test.


## Demo Video
