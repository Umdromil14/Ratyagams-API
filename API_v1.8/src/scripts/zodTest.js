const { z } = require("zod");

const schema = z.object({
    username: z.string().toLowerCase(),
    email: z.string().email({ message: "Invalid email" }),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string().url(),
    isAdmin: z.boolean(),
});

const schema2 = z.object({
    code: z.string().toUpperCase(),
    description: z.string(),
    video_games: z.array(z.object({
        name: z.string(),
        description: z.string(),
        release_date: z.coerce.date(),
        release_price: z.number().nullable(),
        store_page_url: z.string().url().nullable()
    }))
});

const values2 = {
    code: "PS5",
    description: "PlayStation 5",
    video_games: [
        {
            name: "Call of Duty: Black Ops Cold War",
            description: "Call of Duty: Black Ops Cold War",
            release_date: "2021-02-29",
            release_price: 69.99,
            store_page_url: "https://www.activision.com/games/call-of-duty/call-of-duty-black-ops-cold-war"
        },
        {
            name: "Call of Duty: Black Ops Cold War",
            description: "Call of Duty: Black Ops Cold War",
            release_date: new Date("2021-11-11"),
            release_price: 69.99,
            store_page_url: null
        }
    ]
}

const values = {
    username: "Test",
    email: "@gmail.com.com",
    firstname: "test",
    lastname: "test",
    password: "https://www.activision.com/games/call-of-duty/call-of-duty-black-ops-cold-war",
    isAdmin: "",
    test: 1
}

try {
    const result = schema2.parse(values2);
    // result.video_games.forEach((video_game, index, array) => {
    //     array[index].release_date = new Date(video_game.release_date);
    // });
    console.log(result);
} catch (error) {
    const errorMessage = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" & ");
    console.log(errorMessage);
}