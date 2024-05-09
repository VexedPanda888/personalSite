import { Link } from 'react-router-dom';

// TODO: short statement, pictures, experience, approach, inspiration, movement coaching, philosophy
// Short statement: I am most inspired by making the impossible become possible. `  I have been climbing for 4 years and coaching for 3. I was head coach for UVA's Competition Team for 2 years and assistant coach for Sportrock's Youth Teams for 1 year. I want to work with athletes that are psyched and strive to show up and apply themselves in every pursuit.
// I am currently only interested in working with athletes in person, so please keep that in mind when filling out the form. I am happy to just chat and provide information as well.
// Sequence: pictures, short statement - hook, approach, status, contact, OTHER - philosphy, ideas, etc.
// Follow your psych, the best plan is the one you complete.
// Learn the rules to break them.
// You mind and body adapt to the challenges you give thme.
// Principles over techniques.
// Restriction enables creativity.
function CoachingPage() {
    return (
        <div className="App">
            <header className="App-header">
                <h2>This is where you can read about my coaching approach and contact me!</h2>
                <Link to="/" className="App-link">Go Back</Link>
            </header>
        </div>
    );
}

export default CoachingPage;
