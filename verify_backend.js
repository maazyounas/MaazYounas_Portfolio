const API_URL = 'http://localhost:5000/api/projects';

async function testBackend() {
    try {
        console.log("1. Testing POST (Create Project)...");
        const newProject = {
            title: "Test Project Integration",
            description: "Testing backend integration",
            image: "placeholder.png",
            tech: ["Node.js", "Test"],
            link: "http://example.com",
            category: "web",
            complexity: "beginner"
        };
        
        const createRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProject)
        });
        
        if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
        const createdData = await createRes.json();
        const createdId = createdData._id;
        console.log("   Success! Created ID:", createdId);

        console.log("2. Testing GET (List Projects)...");
        const getRes = await fetch(API_URL);
        if (!getRes.ok) throw new Error(`Get failed: ${getRes.status}`);
        const listData = await getRes.json();
        
        const project = listData.find(p => p._id === createdId);
        if (!project) throw new Error("Created project not found in list");
        console.log("   Success! Project found in list.");
        
        if (!project.tech || project.tech.length === 0) console.warn("   Warning: Tech array is empty, schema update might not be effective yet.");

        console.log("3. Testing PUT (Update Project)...");
        const updateRes = await fetch(`${API_URL}/${createdId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visible: false })
        });
        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.status}`);
        const updateData = await updateRes.json();
        if (updateData.visible !== false) throw new Error("Update failed, visible property mismatch");
        console.log("   Success! Project visibility updated.");

        console.log("4. Testing DELETE (Delete Project)...");
        const deleteRes = await fetch(`${API_URL}/${createdId}`, { method: 'DELETE' });
        if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.status}`);
        
        // Verify deletion
        const verifyGet = await fetch(API_URL);
        const verifyData = await verifyGet.json();
        if (verifyData.find(p => p._id === createdId)) throw new Error("Delete failed, project still exists");
        console.log("   Success! Project deleted.");

        console.log("\nALL BACKEND TESTS PASSED!");
    } catch (error) {
        console.error("Test Failed:", error.message);
        if (error.cause) console.error("Cause:", error.cause);
    }
}

testBackend();
