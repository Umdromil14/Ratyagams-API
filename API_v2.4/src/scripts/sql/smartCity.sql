DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    firstname VARCHAR,
    lastname VARCHAR,
    hashed_password VARCHAR NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

DROP TABLE IF EXISTS platform CASCADE;

CREATE TABLE platform (
    code VARCHAR NOT NULL PRIMARY KEY,
    description VARCHAR NOT NULL,
    abbreviation VARCHAR NOT NULL
);

DROP TABLE IF EXISTS video_game CASCADE;

CREATE TABLE video_game(
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);

DROP TABLE IF EXISTS publication CASCADE;

CREATE TABLE publication (
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    platform_code VARCHAR,
    video_game_id integer NOT NULL,
    release_date DATE NOT NULL,
    release_price DECIMAL(5, 2),
    store_page_url VARCHAR,
    FOREIGN KEY (platform_code) REFERENCES platform(code) ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        FOREIGN KEY (video_game_id) REFERENCES video_game(id),
        UNIQUE (platform_code, video_game_id)
);

DROP TABLE IF EXISTS game CASCADE;

CREATE TABLE game (
    user_id INTEGER NOT NULL,
    publication_id integer NOT NULL,
    is_owned BOOLEAN NOT NULL DEFAULT FALSE,
    review_rating integer check (
        review_rating >= 0
        and review_rating <= 5
    ),
    review_comment VARCHAR,
    review_date DATE,
    PRIMARY KEY (user_id, publication_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (publication_id) REFERENCES publication(id)
);

DROP TABLE IF EXISTS genre CASCADE;

CREATE TABLE genre (
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);

DROP TABLE IF EXISTS category CASCADE;

CREATE TABLE category(
    genre_id integer NOT NULL,
    video_game_id integer NOT NULL,
    PRIMARY KEY (genre_id, video_game_id),
    FOREIGN KEY (genre_id) REFERENCES genre(id),
    FOREIGN KEY (video_game_id) REFERENCES video_game(id)
);

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Open World',
        'Open World games allow players to explore and interact with a large, open area.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Fantasy',
        'Fantasy games feature magical and imaginative settings.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Cyberpunk',
        'Cyberpunk games are set in futuristic, dystopian worlds.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Stealth',
        'Stealth games emphasize sneaking and covert missions.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Historical',
        'Historical games are set in real-world historical periods.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Souls-like',
        'Souls-like games are similar to the Souls series.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Post-Apocalyptic',
        'Post-Apocalyptic games are set in a world after a major disaster.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Horror',
        'Horror games focus on creating a terrifying experience for players.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Co-op',
        'Co-op games allow players to work together to achieve a common goal.'
    );

-- Action Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Action',
        'Action games emphasize physical challenges and combat.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'FPS',
        'First-Person Shooter games focus on combat from a first-person perspective.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'TPS',
        'Third-Person Shooter games involve shooting and combat from a third-person view.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Fighting',
        'Fighting games feature one-on-one combat between characters.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Survival',
        'Survival games challenge players to stay alive in harsh conditions.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Beat ''em up',
        'Beat ''em up games involve hand-to-hand combat against multiple enemies.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Metroidvania',
        'Metroidvania games feature a large, interconnected world with areas that can be explored in any order.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Party',
        'Party games are designed for multiplayer fun with friends and family.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Simulation',
        'Simulation games simulate real-world or fictional activities.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Farming',
        'Farming games involve managing a farm and growing crops.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Roguelike',
        'Roguelike games feature procedurally-generated levels and permadeath.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Hunting',
        'Hunting games involve tracking and hunting animals.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Tower Defense',
        'Tower Defense games involve building defenses to stop enemies from reaching a goal.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Building',
        'Building games involve constructing and managing buildings and cities.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Sandbox',
        'Sandbox games allow players to explore and interact with a large, open area.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Battle Royale',
        'Battle Royale games involve a large number of players competing to be the last one standing.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Pirates',
        'Pirate games are set in a world of pirates and piracy.'
    );

-- Adventure Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Action-Adventure',
        'Action-Adventure games combine elements of action and adventure games.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Adventure',
        'Adventure games combine elements of action and adventure games.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Narrative',
        'Narrative games place a strong emphasis on storytelling and character development.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Point-and-Click',
        'Point-and-Click games involve interacting with the environment using a cursor.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'RPG',
        'Role-Playing games allow players to assume the role of a character and make choices.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'War',
        'War games involve military conflicts and combat.'
    );

-- Role-Playing Games (RPG)
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'MMORPG',
        'MMORPGs are online multiplayer games with deep character progression.'
    );

-- Strategy Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'RTS',
        'Real-Time Strategy games involve resource management and combat in real-time.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'TBS',
        'Turn-Based Strategy games allow players to take turns in decision-making.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Management',
        'Management games focus on overseeing and organizing various aspects.'
    );

-- Sports and Racing Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Sports',
        'Sports games simulate real-world sports, like soccer or basketball.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Racing',
        'Racing games involve high-speed competitions with various vehicles.'
    );

-- Puzzle and Brain Teaser Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Puzzle',
        'Puzzle games challenge players with logic, patterns, and problem-solving.'
    );

-- INSERT INTO GENRE (name, description) VALUES ('Brain Teaser', 'Brain Teaser games provide mind-bending challenges.');
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Platform',
        'Platform games involve running and jumping across platforms and obstacles.'
    );

-- Music and Rhythm Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Rhythm',
        'Rhythm games require players to time actions with the beat of the music.'
    );

-- Simulation Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Simulation',
        'Simulation games simulate real-world or fictional activities.'
    );

-- Educational Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Educational',
        'Educational games are designed to teach players about a specific topic.'
    );

-- Card and Board Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Card',
        'Card games are played with a standard deck or specialized cards.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Board',
        'Board games are played on a board with counters or pieces.'
    );

-- Horror Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Survival Horror',
        'Survival Horror games emphasize survival in a terrifying environment.'
    );

-- Science Fiction and Fantasy Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Science Fiction',
        'Science Fiction games are set in futuristic or space-themed worlds.'
    );

-- Online Multiplayer Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'MOBA',
        'Multiplayer Online Battle Arena games involve team-based combat in a large arena.'
    );

-- Virtual Reality (VR) Games
INSERT INTO
    GENRE (name, description)
VALUES
    (
        'VR',
        'VR games are specifically designed for immersive virtual reality experiences.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    (
        'Multiplayer',
        'Multiplayer games allow players to compete or cooperate with each other in various ways.'
    );

INSERT INTO
    GENRE (name, description)
VALUES
    ('Solo', 'games that are played alone');

-- genres = {
-- 1: 'Open World',
-- 2: 'Fantasy',
-- 3: 'Cyberpunk',
-- 4: 'Stealth',
-- 5: 'Historical',
-- 6: 'Souls-like',
-- 7: 'Post-Apocalyptic',
-- 8: 'Horror',
-- 9: 'Co-op',
-- 10: 'Action',
-- 11: 'FPS',
-- 12: 'TPS',
-- 13: 'Fighting',
-- 14: 'Survival',
-- 15: 'Beat ''em up',
-- 16: 'Metroidvania',
-- 17: 'Party',
-- 18: 'Simulation',
-- 19: 'Farming',
-- 20: 'Roguelike',
-- 21: 'Hunting',
-- 22: 'Tower Defense',
-- 23: 'Building',
-- 24: 'Sandbox',
-- 25: 'Battle Royale',
-- 26: 'Pirates',
-- 27: 'Action-Adventure',
-- 28: 'Adventure',
-- 29: 'Narrative',
-- 30: 'Point-and-Click',
-- 31: 'RPG',
-- 32: 'War',
-- 33: 'MMORPG',
-- 34: 'RTS',
-- 35: 'TBS',
-- 36: 'Management',
-- 37: 'Sports',
-- 38: 'Racing',
-- 39: 'Puzzle',
-- 40: 'Platform',
-- 41: 'Rhythm',
-- 42: 'Simulation',
-- 43: 'Educational',
-- 44: 'Card',
-- 45: 'Board',
-- 46: 'Survival Horror',
-- 47: 'Science Fiction',
-- 48: 'MOBA',
-- 49: 'VR',
-- 50: 'Multiplayer',
-- 51: 'Solo'
-- }
-- videoGames = {
-- 1: 'Call of Duty: Black Ops Cold War',
-- 2: 'FIFA 21',
-- 3: 'The Legend of Zelda: Breath of the Wild',
-- 4: 'Cyberpunk 2077',
-- 5: 'Red Dead Redemption 2',
-- 6: 'The Witcher 3: Wild Hunt',
-- 7: 'Grand Theft Auto V',
-- 8: 'Call of Duty: Modern Warfare',
-- 9: 'Minecraft',
-- 10: 'Assassin''s Creed Valhalla',
-- 11: 'Super Mario Odyssey',
-- 12: 'The Elder Scrolls V: Skyrim',
-- 13: 'Sekiro: Shadows Die Twice',
-- 14: 'Horizon Zero Dawn',
-- 15: 'Doom Eternal',
-- 16: 'The Last of Us Part II',
-- 17: 'Star Wars Jedi: Fallen Order',
-- 18: 'Halo: Infinite',
-- 19: 'Resident Evil Village',
-- 20: 'Ghost of Tsushima',
-- 21: 'Final Fantasy VII',
-- 22: 'Death Stranding',
-- 23: 'Demon''s Souls',
-- 24: 'Fallout 4',
-- 25: 'Genshin Impact',
-- 26: 'Borderlands 3',
-- 27: 'The Outer Worlds',
-- 28: 'Control',
-- 29: 'The Medium',
-- 30: 'Nioh 2',
-- 31: 'Watch Dogs: Legion',
-- 32: 'Bioshock Infinite',
-- 33: 'Dying Light 2 stay human',
-- 34: 'Fall Guys: Ultimate Knockout',
-- 35: 'God of War I',
-- 36: 'God of War II',
-- 37: 'God of War: Betrayal',
-- 38: 'God of War: Chains of Olympus',
-- 39: 'God of War: III',
-- 40: 'God of War: Ghost of Sparta',
-- 41: 'God of War: Ascension',
-- 42: 'God of War',
-- 43: 'God of War: Ragnarok',
-- 44: 'God of War III Remastered',
-- 45: 'Stardew Valley',
-- 46: 'Hades',
-- 47: 'Baldur''s Gate 3',
-- 48: 'Monster Hunter: World',
-- 49: 'Cyber Shadow',
-- 50: 'Animal Crossing: New Horizons',
-- 51: 'Tom Clancy''s Rainbow Six Siege',
-- 52: 'Final Fantasy VII Remake',
-- 53: 'League of Legends',
-- 54: 'Apex Legends',
-- 55: 'Among Us',
-- 56: 'Call of Duty: Warzone',
-- 57: 'Fortnite',
-- 58: 'Overwatch',
-- 59: 'Valorant',
-- 60: 'Destiny 2',
-- 61: 'Counter-Strike: Global Offensive',
-- 62: 'Rocket League',
-- 63: 'Sea of Thieves',
-- 64: 'World of Warcraft',
-- 65: 'Dead by Daylight',
-- 66: 'Phasmophobia',
-- 67: 'The Sims 4',
-- 68: 'Rust',
-- 69: 'RuneScape',
-- 70: 'Path of Exile',
-- 71: 'World of Tanks',
-- 72: 'Warframe',
-- 73: 'Team Fortress 2',
-- 74: 'Dota 2',
-- 75: 'Smite',
-- 76: 'Guild Wars 2',
-- 77: 'Arma 3',
-- 78: 'Outlast',
-- 79: 'The Forest',
-- 80: 'Left 4 Dead 2',
-- 81: 'Among the Sleep',
-- 82: 'Alien: Isolation',
-- 83: 'Amnesia: The Dark Descent',
-- 84: 'The Evil Within',
-- 85: 'Dead Space',
-- 86: 'Dark Souls',
-- 87: 'Dark Souls II',
-- 88: 'Dark Souls III',
-- 89: 'Bloodborne',
-- 90: 'The Surge',
-- 91: 'Lords of the Fallen',
-- 92: 'Salt and Sanctuary',
-- 93: 'Hollow Knight',
-- 94: 'Ashen',
-- 95: 'Nioh',
-- 96: 'Remnant: From the Ashes',
-- 97: 'Blasphemous',
-- 98: 'Code Vein',
-- 99: 'Mortal Shell',
-- 100: 'Elden Ring',
-- 101: 'Bloons TD 6',
-- 102: 'Squewe Run',
-- }
-- Plateforme 1 : PC
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PC', 'PC (Windows)', 'PC');

-- Plateforme 2 : PlayStation 5
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PS5', 'PlayStation 5', 'PS5');

-- Plateforme 3 : Xbox Series X
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('XSX', 'Xbox Series X', 'Xbox Series X');

-- Plateforme 4 : Nintendo Switch
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('NSW', 'Nintendo Switch', 'Switch');

-- Plateforme 5 : PlayStation 4
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PS4', 'PlayStation 4', 'PS4');

-- Plateforme 6 : Xbox One
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('XBO', 'Xbox One', 'Xbox One');

-- Plateforme 7 : Mobile (iOS/Android)
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('MOB', 'Mobile (Android/IOS)', 'Mobile');

-- Plateforme 8 : Nintendo 3DS
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('3DS', 'Nintendo 3DS', '3DS');

-- Plateforme 9 : PlayStation 3
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PS3', 'PlayStation 3', 'PS3');

-- Plateforme 10 : Xbox 360
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('X360', 'Xbox 360', 'Xbox 360');

-- Plateforme 11 : PlayStation 2
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PS2', 'PlayStation 2', 'PS2');

-- Plateforme 12 : Xbox
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('XB', 'Xbox', 'Xbox');

-- Plateforme 14 : Wii
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('WII', 'Wii', 'Wii');

-- Plateforme 15 : Wii U
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('WIIU', 'Wii U', 'Wii U');

-- Plateforme 16 : PlayStation Vita
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PSV', 'PlayStation Vita', 'PS Vita');

-- Plateforme 17 : PSP (PlayStation Portable)
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PSP', 'PSP (PlayStation Portable)', 'PSP');

-- Plateforme 18 : Nintendo DS
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('NDS', 'Nintendo DS', 'DS');

-- Plateforme 31 : PS1
INSERT INTO
    platform (code, description, abbreviation)
VALUES
    ('PS1', 'PlayStation 1', 'PS1');

INSERT INTO
    "user" (
        username,
        email,
        firstname,
        lastname,
        hashed_password,
        is_admin
    )
VALUES
    (
        'BG',
        'bg@email.com',
        'B',
        'G',
        '$2b$10$GwlQ16JZc9vETe68zH4G9.aYYbnWt6XYsECZVFUhJAw56ARzwrsFy',
        true
    );

--M0nk$yReview
INSERT INTO
    "user" (username, email, hashed_password, is_admin)
VALUES
    (
        'admin',
        'admin@gmail.com',
        '$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG',
        true
    );

--password
-- Assurez-vous d'avoir déjà créé une table nommée "user" avec les colonnes id, username, email, firstname, lastname, hashed_password et is_admin.
-- Insérer la deuxième ligne (ligne 4 dans vos données) et les suivantes
INSERT INTO
    "user" (
        username,
        email,
        firstname,
        lastname,
        hashed_password,
        is_admin
    )
VALUES
    (
        'alice_smith',
        'alice@example.com',
        'Alice',
        'Smith',
        '$2b$10$4fyUwT1RUzg7qOMgNJN6ie4fa3PUkYvOhhNkGnX1HFR6CKoHILheG',
        false
    ),
    --password123
    (
        'johndoe123',
        'john.doe@email.com',
        'John',
        'Doe',
        '$2b$10$8o4DPTBRPVT8UKFZhWP5W..WZGEO.wGpeIpFCyNCjixux8N.JPjze',
        false
    ),
    --mySecurePassword 
    (
        'emily_jones',
        'emilyj@email.net',
        'Emily',
        'Jones',
        '$2b$10$7yZ1iPSM2tHcgloZ6bE0NOy6XRZfukAp.7C4F0rhgxwCxfMjkzEnS',
        false
    ),
    --emilyP@ssword
    (
        'michaelbrown',
        'mike.brown@example.org',
        'Michael',
        'Brown',
        '$2b$10$HQFa64/R2BhATPjv0rxt7Owe8kprBtjTzDgFnlhiOJSzPIWFt.xtK',
        false
    ),
    --P@ssw0rd
    (
        'sarah_wilson',
        'sarah@example.org',
        'Sarah',
        'Wilson',
        '$2b$10$UgHLahhJCr9Wp429fEiy5.WnfrtWWdOYG7FEwWGiByhhuq8aiLhhK',
        false
    ),
    --SecurePwd2023
    (
        'david_jackson',
        'davidj@example.com',
        'David',
        'Jackson',
        '$2b$10$igZoQoYOmU/RE0x5BQg11OWEuOXk4fRS34hfDYm3uqr/HVXZ.S912',
        false
    ),
    --D@v1dPwd
    (
        'lisa_anderson',
        'lisa@email.net',
        'Lisa',
        'Anderson',
        '$2b$10$LltB7Y8QKQIr5GinCWk2fOKamNd8AvzQFvrNeIxzuHWzr9n2mZRce',
        false
    ),
    --L1s@Pass
    (
        'robert_miller',
        'robert.m@example.com',
        'Robert',
        'Miller',
        '$2b$10$AHMY/FWUFAGawkeiUaw4/ecAVOnXn7iibqQ66kFhBfdNTeQdu9ez.',
        false
    ),
    --R0bertPwd!
    (
        'linda_davis',
        'linda@example.org',
        'Linda',
        'Davis',
        '$2b$10$MPiC4xBEcBagB4oDcwRoduG/QCn/Cb3oCVUjEi1RvWMfNP2.cclCC',
        false
    ),
    --L1ndaP@ss
    (
        'william_wilkins',
        'will@example.net',
        'William',
        'Wilkins',
        '$2b$10$fHVkPUxjGIDs2vqIlxPf7OQ.WtSSg5dLCjA9KDhy.moTHixmdXSSC',
        false
    );

--W1ll1amP@ssw0rd
-- Jeu 1
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Call of Duty: Black Ops Cold War',
        'The iconic Black Ops series is back with Call of Duty®: Black Ops Cold War - the direct sequel to the original and fan-favorite Call of Duty®: Black Ops.'
    );

-- Jeu 2
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'FIFA 21',
        'Win as one in EA SPORTS™ FIFA 21, powered by Frostbite™. Whether it''s on the streets or in the stadium, FIFA 21 has more ways to play than ever before - including the UEFA Champions League and CONMEBOL Libertadores.'
    );

-- Jeu 3
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Legend of Zelda: Breath of the Wild',
        'Explore the vast world of Hyrule and embark on an epic adventure in this critically acclaimed action-adventure game.'
    );

-- Jeu 4
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Cyberpunk 2077',
        'Step into the dystopian future of Night City in Cyberpunk 2077, an open-world RPG with a branching narrative and intense combat.'
    );

-- Jeu 5
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Red Dead Redemption 2',
        'Immerse yourself in the Wild West as Arthur Morgan in this epic tale of outlaws, loyalty, and survival.'
    );

-- Jeu 6
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Witcher 3: Wild Hunt',
        'Embark on a quest as Geralt of Rivia in this open-world RPG, filled with monsters, magic, and unforgettable characters.'
    );

-- Jeu 7
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Grand Theft Auto V',
        'Experience the criminal underworld of Los Santos in this action-packed open-world game from Rockstar.'
    );

-- Jeu 8
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Call of Duty: Modern Warfare',
        'Engage in intense warfare and tactical combat in this reboot of the Modern Warfare series.'
    );

-- Jeu 9
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Minecraft',
        'Build and explore your own blocky world in the immensely popular sandbox game.'
    );

-- Jeu 10
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Assassin''s Creed Valhalla',
        'Embark on a Viking adventure in this Assassin''s Creed title set in the Viking Age.'
    );

-- Jeu 11
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Super Mario Odyssey',
        'Join Mario on a globe-trotting adventure to rescue Princess Peach in this Nintendo classic.'
    );

-- Jeu 12
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Elder Scrolls V: Skyrim',
        'Enter the world of Tamriel and explore the frozen land of Skyrim in this epic RPG.'
    );

-- Jeu 13
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Sekiro: Shadows Die Twice',
        'Master the way of the shinobi and face challenging foes in this action-adventure game.'
    );

-- Jeu 14
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Horizon Zero Dawn',
        'Venture into a post-apocalyptic world as Aloy in this action RPG filled with robotic creatures.'
    );

-- Jeu 15
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Doom Eternal',
        'Rip and tear through the forces of Hell in this high-octane first-person shooter.'
    );

-- Jeu 16
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Last of Us Part II',
        'Experience a gripping post-apocalyptic story in this emotionally charged action-adventure game.'
    );

-- Jeu 17
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Star Wars Jedi: Fallen Order',
        'Become a Jedi and uncover the mysteries of the Force in this Star Wars action-adventure.'
    );

-- Jeu 18
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Halo: Infinite',
        'Master Chief returns in this epic sci-fi first-person shooter, continuing the Halo saga.'
    );

-- Jeu 19
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Resident Evil Village',
        'Enter a mysterious village and face grotesque horrors in this survival horror game.'
    );

-- Jeu 20
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Ghost of Tsushima',
        'Become a samurai in feudal Japan and defend your homeland in this open-world action game.'
    );

-- Jeu 21
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Final Fantasy VII',
        'Relive the classic RPG with updated graphics and an expanded story.'
    );

-- Jeu 22
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Death Stranding',
        'Navigate a post-apocalyptic world as Sam Porter Bridges in this unique open-world game.'
    );

-- Jeu 23
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Demon''s Souls',
        'Challenge your skills and courage in the remake of this iconic action RPG.'
    );

-- Jeu 24
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Fallout 4',
        'Survive the wasteland and shape your destiny in this open-world RPG from Bethesda.'
    );

-- Jeu 25
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Genshin Impact',
        'Embark on an adventure in the fantasy world of Teyvat in this action RPG.'
    );

-- Jeu 26
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Borderlands 3',
        'Team up with friends in this cooperative shooter and explore the chaotic world of Pandora.'
    );

-- Jeu 27
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Outer Worlds',
        'Uncover corporate conspiracies and make choices in this sci-fi RPG.'
    );

-- Jeu 28
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Control',
        'Assume the role of Jesse Faden and investigate supernatural mysteries in this action-adventure game.'
    );

-- Jeu 29
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Medium',
        'Delve into a dark and mysterious dual-reality world in this psychological horror game.'
    );

-- Jeu 30
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Nioh 2',
        'Face challenging yokai and samurai in this action RPG set in feudal Japan.'
    );

-- Jeu 31
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Watch Dogs: Legion',
        'Recruit and play as anyone in a dystopian London in this open-world game.'
    );

-- Jeu 32
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Bioshock Infinite',
        'Explore the floating city of Columbia and uncover its secrets in this first-person shooter.'
    );

-- Jeu 33
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dying Light 2 stay human',
        'Survive a zombie-infested city and use parkour skills to navigate in this survival horror game.'
    );

-- Jeu 34
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Fall Guys: Ultimate Knockout',
        'Compete in a whimsical battle royale with other players in this fun and colorful game.'
    );

-- Jeu GOW 35,36,37,38,39,40,41,42,43,44
INSERT INTO
    video_game ("name", description)
VALUES
    (
        'God of War I',
        'The protagonist of the game is Kratos, a Spartan warrior who serves the gods of Olympus. Other characters include many Greek gods, including Athena, the goddess of wisdom and the ally and mentor of Kratos; Ares, the god of war and main antagonist; Poseidon, the god of the sea and the oceans; Aphrodite, the goddess of love and sensuality; Zeus, the king of the gods; Artemis, the goddess of hunting; and Hades, the god of the underworld.'
    ),
    (
        'God of War II',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    ),
    (
        'God of War: Betrayal',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    ),
    (
        'God of War: Chains of Olympus',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    ),
    (
        'God of War III',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    ),
    (
        'God of War: Ghost of Sparta',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    ),
    (
        'God of War: Ascension',
        'Discover the origins of Kratos as he takes his first steps on a now legendary quest for freedom and vengeance.'
    ),
    (
        'God of War',
        'Join Kratos and his son Atreus as they embark on a journey to fulfill a deeply personal quest in this critically acclaimed action game.'
    ),
    (
        'God of War: Ragnarok',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    ),
    (
        'God of War III Remastered',
        'Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Stardew Valley',
        'Escape to the countryside and build the farm of your dreams in this charming life simulation game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Hades',
        'Descend into the underworld and battle your way out in this roguelike action game with a rich narrative.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Baldur''s Gate 3',
        'Dive into an epic, Dungeons & Dragons-inspired RPG with rich storytelling and tactical battles.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Monster Hunter: World',
        'Hunt massive creatures in a lush, living ecosystem in this action-packed adventure.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Cyber Shadow',
        'Experience a retro-inspired action platformer with ninja combat and challenging levels.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Animal Crossing: New Horizons',
        'Create your island paradise and enjoy a relaxing life simulation game with adorable animal villagers.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Tom Clancy''s Rainbow Six Siege',
        'Engage in tactical, team-based battles as an operator in this popular first-person shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Final Fantasy VII Remake',
        'Relive the classic RPG with stunning visuals and reimagined gameplay in this epic remake.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'League of Legends',
        'Join a team of champions and battle in strategic, fast-paced matches in the world''s most popular MOBA.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Apex Legends',
        'Form a squad of unique characters with special abilities and compete in a fast-paced battle royale.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Among Us',
        'Work together with friends on a spaceship, but beware of impostors trying to sabotage your missions.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Call of Duty: Warzone',
        'Drop into a massive battle royale map and engage in intense warfare with realistic weapons and tactics.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Fortnite',
        'Join the battle royale phenomenon and build, fight, and survive with friends in this high-energy game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Overwatch',
        'Choose from a diverse cast of heroes and engage in team-based combat in this popular first-person shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Valorant',
        'Join a team of agents with special abilities and engage in tactical, team-based combat in this FPS.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Destiny 2',
        'Explore the solar system and experience epic battles in this sci-fi MMO with FPS elements.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Counter-Strike: Global Offensive',
        'Engage in tactical, team-based combat in this classic first-person shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Rocket League',
        'Play soccer with rocket-powered cars in this unique sports game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Sea of Thieves',
        'Sail the seas and embark on a pirate adventure with friends in this open-world MMO.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'World of Warcraft',
        'Explore the world of Azeroth and join thousands of players in this massively multiplayer online game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dead by Daylight',
        'Play as either a survivor or a killer in a multiplayer horror game filled with suspense and strategy as you try to escape or hunt.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Phasmophobia',
        'Work with friends to investigate paranormal activity in this cooperative horror game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Sims 4',
        'Create unique Sims and build the perfect home in this popular life simulation game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Rust',
        'Survive the wilderness and build a home in this multiplayer survival game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'RuneScape',
        'Explore the world of Gielinor and embark on an epic adventure in this classic MMO.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Path of Exile',
        'Explore a dark fantasy world and customize your character in this free-to-play action RPG.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'World of Tanks',
        'Engage in massive tank battles in this popular free-to-play MMO.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Warframe',
        'Choose from a variety of powerful Warframes and engage in third-person combat in this free-to-play action game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Team Fortress 2',
        'Join a team of mercenaries and engage in team-based combat in this popular free-to-play first-person shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dota 2',
        'Join a team of heroes and battle in a strategic, team-based MOBA in this popular free-to-play game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Smite',
        'Choose from a diverse cast of gods and engage in strategic, team-based combat in this popular MOBA.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Guild Wars 2',
        'Explore the world of Tyria and engage in epic battles in this popular MMO.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Arma 3',
        'Engage in tactical combat in this military simulator with realistic weapons and vehicles.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Outlast',
        'Enter the Mount Massive Asylum and survive the horrors within in this first-person psychological horror game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Forest',
        'Survive the wilderness and build a shelter in this open-world survival game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Left 4 Dead 2',
        'Survive the zombie apocalypse with friends in this cooperative first-person shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Among the Sleep',
        'Experience a unique horror adventure as a toddler navigating a spooky world filled with surreal terrors.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Alien: Isolation',
        'Survive a deadly alien threat in this first-person survival horror game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Amnesia: The Dark Descent',
        'Explore a dark castle and uncover its secrets in this first-person survival horror game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Evil Within',
        'Survive a nightmarish world filled with horrifying creatures in this third-person survival horror game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dead Space',
        'Fight for survival in a sci-fi horror adventure in this third-person shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dark Souls',
        'Dive into the unforgiving and interconnected world of Lordran, where methodical and demanding combat blends with cryptic and profound storytelling.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dark Souls II',
        'Explore the kingdom of Drangleic and face equally formidable challenges in this sequel to the Souls series, offering new gameplay mechanics and diverse environments.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Dark Souls III',
        'Return to a world in decline as an Ashen One and confront terrifying enemies and titanic bosses in this final installment of the Souls series.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Bloodborne',
        'Explore the eldritch nightmare of Yharnam, filled with grotesque creatures and fast-paced combat in this action RPG by FromSoftware.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'The Surge',
        'Uncover a dystopian future filled with rogue AI and combat-enhanced exosuits in this sci-fi Souls-like action RPG.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Lords of the Fallen',
        'Embark on a quest to defeat powerful lords in a dark and challenging fantasy world reminiscent of the Souls series.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Salt and Sanctuary',
        'Experience a 2D side-scrolling Souls-like game with intricate level design and a grim, atmospheric world.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Hollow Knight',
        'Explore the mysterious, underground world of Hallownest and battle challenging foes in this beautifully hand-drawn 2D metroidvania.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Ashen',
        'Journey through a world without light and forge alliances in this cooperative Souls-like action RPG with a unique art style.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Nioh',
        'Face challenging yokai and samurai in this action RPG set in feudal Japan.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Remnant: From the Ashes',
        'Fight for survival in a post-apocalyptic world filled with monstrous creatures in this cooperative Souls-like shooter.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Blasphemous',
        'Embark on a dark and punishing pilgrimage through a nightmarish world filled with grotesque enemies and religious themes in this 2D action platformer.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Code Vein',
        'Explore a post-apocalyptic world as a vampire-like Revenant, battling hordes of enemies and uncovering the mysteries of your existence in this anime-inspired Souls-like game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Mortal Shell',
        'Take on the role of a "foundling" who possesses the ability to inhabit the bodies of fallen warriors in this dark and atmospheric action RPG.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Elden Ring',
        'Delve into a new dark fantasy world created by Hidetaka Miyazaki and George R. R. Martin, featuring an expansive open world and intense Souls-like combat.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    (
        'Bloons TD 6',
        'Defend your towers from waves of balloons in this popular tower defense game.'
    );

INSERT INTO
    video_game ("name", description)
VALUES
    ('Squewe Run', 'Goofy ahh cat game');

-- 1.Call of Duty: Black Ops Cold War | wikipedia: https://en.wikipedia.org/wiki/Call_of_Duty:_Black_Ops_Cold_War
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        1,
        '2020-11-13',
        69.99,
        'https://www.activision.com/games/call-of-duty/call-of-duty-black-ops-cold-war'
    ),
    (
        'PS5',
        1,
        '2020-11-13',
        79.99,
        'https://www.playstation.com/en-us/games/call-of-duty-black-ops-cold-war/'
    ),
    (
        'XSX',
        1,
        '2020-11-13',
        79.99,
        'https://www.xbox.com/en-us/games/store/call-of-duty-black-ops-cold-war/9N2DMQBN9RC4/0010/9TJ9G6F6DMK1'
    ),
    (
        'PS4',
        1,
        '2020-11-13',
        69.99,
        'https://www.playstation.com/en-us/games/call-of-duty-black-ops-cold-war/'
    ),
    (
        'XBO',
        1,
        '2020-11-13',
        69.99,
        'https://www.xbox.com/en-us/games/store/call-of-duty-black-ops-cold-war/9N2DMQBN9RC4/0010/9TJ9G6F6DMK1'
    );

-- 2.FIFA 21 | wikipedia: https://en.wikipedia.org/wiki/FIFA_21
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price
    )
VALUES
    ('PC', 2, '2020-10-09', 59.99),
    ('PS5', 2, '2020-12-03', 69.99),
    ('XSX', 2, '2020-12-03', 69.99),
    ('PS4', 2, '2020-10-09', 59.99),
    ('XBO', 2, '2020-10-09', 59.99),
    ('NSW', 2, '2020-10-09', 59.99);

-- 3.The Legend of Zelda: Breath of the Wild | wikipedia: https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild 
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'NSW',
        3,
        '2017-03-03',
        59.99,
        'https://www.nintendo.com/games/detail/the-legend-of-zelda-breath-of-the-wild-switch/'
    ),
    ('WIIU', 3, '2017-03-03', 59.99, null);

-- 4.Cyberpunk 2077 | wikipedia: https://en.wikipedia.org/wiki/Cyberpunk_2077
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        4,
        '2020-12-10',
        59.99,
        'https://store.steampowered.com/app/1091500/Cyberpunk_2077/'
    ),
    (
        'PS5',
        4,
        '2022-02-15',
        59.99,
        'https://www.playstation.com/en-us/games/cyberpunk-2077/'
    ),
    (
        'XSX',
        4,
        '2022-02-15',
        59.99,
        'https://www.xbox.com/en-us/games/store/cyberpunk-2077/bx3m8l83bbrw'
    ),
    (
        'PS4',
        4,
        '2020-12-10',
        59.99,
        'https://www.playstation.com/en-us/games/cyberpunk-2077/'
    ),
    (
        'XBO',
        4,
        '2020-12-10',
        59.99,
        'https://www.xbox.com/en-us/games/store/cyberpunk-2077/bx3m8l83bbrw'
    );

-- 5.Red Dead Redemption 2 | wikipedia: https://en.wikipedia.org/wiki/Red_Dead_Redemption_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        5,
        '2019-11-05',
        59.99,
        'https://www.rockstargames.com/reddeadredemption2/'
    ),
    (
        'PS4',
        5,
        '2018-10-26',
        59.99,
        'https://www.rockstargames.com/reddeadredemption2/'
    ),
    (
        'XBO',
        5,
        '2018-10-26',
        59.99,
        'https://www.rockstargames.com/reddeadredemption2/'
    );

-- 6.The Witcher 3: Wild Hunt | wikipedia: https://en.wikipedia.org/wiki/The_Witcher_3:_Wild_Hunt
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        6,
        '2015-05-19',
        39.99,
        'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/'
    ),
    (
        'PS5',
        6,
        '2022-12-14',
        59.99,
        'https://www.playstation.com/en-us/games/the-witcher-3-wild-hunt-ps4/'
    ),
    (
        'XSX',
        6,
        '2022-12-14',
        59.99,
        'https://www.xbox.com/en-us/games/store/the-witcher-3-wild-hunt/br765873cqjd'
    ),
    (
        'PS4',
        6,
        '2015-05-19',
        39.99,
        'https://www.playstation.com/en-us/games/the-witcher-3-wild-hunt-ps4/'
    ),
    (
        'XBO',
        6,
        '2015-05-19',
        39.99,
        'https://www.xbox.com/en-us/games/store/the-witcher-3-wild-hunt/br765873cqjd'
    ),
    (
        'NSW',
        6,
        '2019-10-15',
        59.99,
        'https://www.nintendo.com/games/detail/the-witcher-3-wild-hunt-complete-edition-switch/'
    );

-- 7.Grand Theft Auto V | wikipedia: https://en.wikipedia.org/wiki/Grand_Theft_Auto_V
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        7,
        '2015-04-14',
        29.99,
        'https://www.rockstargames.com/V/'
    ),
    (
        'PS5',
        7,
        '2022-03-15',
        59.99,
        'https://www.rockstargames.com/V/'
    ),
    (
        'XSX',
        7,
        '2022-03-15',
        59.99,
        'https://www.rockstargames.com/V/'
    ),
    (
        'PS4',
        7,
        '2014-11-18',
        29.99,
        'https://www.rockstargames.com/V/'
    ),
    (
        'XBO',
        7,
        '2014-11-18',
        29.99,
        'https://www.rockstargames.com/V/'
    ),
    ('PS3', 7, '2013-09-17', 29.99, null),
    ('X360', 7, '2013-09-17', 29.99, null);

-- 8.Call of Duty: Modern Warfare | wikipedia: https://en.wikipedia.org/wiki/Call_of_Duty:_Modern_Warfare_(2019_video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        8,
        '2019-10-25',
        59.99,
        'https://store.steampowered.com/app/2000950/Call_of_Duty_Modern_Warfare/'
    ),
    (
        'PS4',
        8,
        '2019-10-25',
        59.99,
        'https://www.playstation.com/en-us/games/call-of-duty-modern-warfare/'
    ),
    (
        'XBO',
        8,
        '2019-10-25',
        59.99,
        'https://www.xbox.com/en-us/games/store/call-of-duty-modern-warfare/c5dtj99626k3'
    );

-- 9.Minecraft | wikipedia: https://en.wikipedia.org/wiki/Minecraft
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        9,
        '2011-11-18',
        19.99,
        'https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc'
    ),
    (
        'PS4',
        9,
        '2014-09-04',
        19.99,
        'https://www.playstation.com/en-us/games/minecraft/'
    ),
    (
        'XBO',
        9,
        '2014-09-05',
        19.99,
        'https://www.xbox.com/en-us/games/store/minecraft/9mvxmvt8zkwc'
    ),
    (
        'NSW',
        9,
        '2017-05-17',
        29.99,
        'https://www.nintendo.com/us/store/products/minecraft-deluxe-collection-switch/'
    ),
    (
        'MOB',
        9,
        '2011-10-07',
        6.99,
        'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe&hl=en&gl=US'
    ),
    ('PS3', 9, '2013-12-18', 19.99, null),
    ('X360', 9, '2012-05-09', 19.99, null),
    ('PSV', 9, '2014-10-15', 19.99, null),
    ('WIIU', 9, '2015-12-17', 29.99, null),
    ('3DS', 9, '2017-09-13', 29.99, null);

-- 10. Assassin's Creed Valhalla | wikipedia: https://en.wikipedia.org/wiki/Assassin%27s_Creed_Valhalla
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        10,
        '2020-11-10',
        59.99,
        'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'
    ),
    (
        'PS5',
        10,
        '2020-11-19',
        59.99,
        'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'
    ),
    (
        'XSX',
        10,
        '2020-11-10',
        59.99,
        'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'
    ),
    (
        'PS4',
        10,
        '2020-11-10',
        59.99,
        'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'
    ),
    (
        'XBO',
        10,
        '2020-11-10',
        59.99,
        'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'
    );

-- 11.Super Mario Odyssey | wikipedia: https://en.wikipedia.org/wiki/Super_Mario_Odyssey
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'NSW',
        11,
        '2017-10-27',
        59.99,
        'https://www.nintendo.com/games/detail/super-mario-odyssey-switch/'
    );

-- 12.The Elder Scrolls V: Skyrim | wikipedia: https://en.wikipedia.org/wiki/The_Elder_Scrolls_V:_Skyrim
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        12,
        '2011-11-11',
        19.99,
        'https://store.steampowered.com/app/72850/The_Elder_Scrolls_V_Skyrim/'
    ),
    (
        'PS5',
        12,
        '2021-11-11',
        59.99,
        'https://www.playstation.com/en-us/games/the-elder-scrolls-v-skyrim/'
    ),
    (
        'XSX',
        12,
        '2021-11-11',
        59.99,
        'https://www.xbox.com/en-us/games/store/the-elder-scrolls-v-skyrim-special-edition/bq1w1t1fc14w'
    ),
    (
        'PS4',
        12,
        '2016-10-28',
        19.99,
        'https://www.playstation.com/en-us/games/the-elder-scrolls-v-skyrim/'
    ),
    (
        'XBO',
        12,
        '2016-10-28',
        19.99,
        'https://www.xbox.com/en-us/games/store/the-elder-scrolls-v-skyrim-special-edition/bq1w1t1fc14w'
    ),
    (
        'NSW',
        12,
        '2017-11-17',
        59.99,
        'https://www.nintendo.com/games/detail/the-elder-scrolls-v-skyrim-switch/'
    ),
    ('PS3', 12, '2011-11-11', 19.99, null),
    ('X360', 12, '2011-11-11', 19.99, null);

-- 13.Sekiro: Shadows Die Twice | wikipedia: https://en.wikipedia.org/wiki/Sekiro:_Shadows_Die_Twice
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        13,
        '2019-03-22',
        59.99,
        'https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/'
    ),
    (
        'PS4',
        13,
        '2019-03-22',
        59.99,
        'https://www.playstation.com/en-us/games/sekiro-shadows-die-twice/'
    ),
    (
        'XBO',
        13,
        '2019-03-22',
        59.99,
        'https://www.xbox.com/en-us/games/store/sekiro-shadows-die-twice-goty-edition/bqd5wrrp2d6q'
    );

-- 14.Horizon Zero Dawn | wikipedia: https://en.wikipedia.org/wiki/Horizon_Zero_Dawn
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        14,
        '2020-08-07',
        49.99,
        'https://store.steampowered.com/app/1151640/Horizon_Zero_Dawn_Complete_Edition/'
    ),
    (
        'PS4',
        14,
        '2017-03-01',
        19.99,
        'https://www.playstation.com/en-us/games/horizon-zero-dawn/'
    );

-- 15.Doom Eternal | wikipedia: https://en.wikipedia.org/wiki/Doom_Eternal
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        15,
        '2020-03-20',
        59.99,
        'https://store.steampowered.com/app/782330/DOOM_Eternal/'
    ),
    (
        'PS5',
        15,
        '2021-06-29',
        59.99,
        'https://www.playstation.com/e1212n-us/games/doom-eternal/'
    ),
    (
        'XSX',
        15,
        '2021-06-29',
        59.99,
        'https://www.xbox.com/en-us/games/store/doom-eternal-standard-edition/9p5s26314hwq'
    ),
    (
        'PS4',
        15,
        '2020-03-20',
        59.99,
        'https://www.playstation.com/en-us/ga12mes/doom-eternal/'
    ),
    (
        'XBO',
        15,
        '2020-03-20',
        59.99,
        'https://www.xbox.com/en-us/games/store/doom-eternal-standard-edition/9p5s26314hwq'
    ),
    (
        'NSW',
        15,
        '2020-12-08',
        59.99,
        'https://www.nintendo.com/games/detail/doom-eternal-switch/'
    );

-- 16.The Last of Us Part II | wikipedia: https://en.wikipedia.org/wiki/The_Last_of_Us_Part_II
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS4',
        16,
        '2020-06-19',
        59.99,
        'https://www.playstation.com/en-us/games/the-last-of-us-part-ii/'
    );

-- 17.Star Wars Jedi: Fallen Order | wikipedia: https://en.wikipedia.org/wiki/Star_Wars_Jedi:_Fallen_Order
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        17,
        '2019-11-15',
        59.99,
        'https://store.steampowered.com/app/1172380/STAR_WARS_Jedi_Fallen_Order/'
    ),
    (
        'PS5',
        17,
        '2021-06-11',
        59.99,
        'https://www.playstation.com/en-us/games/star-wars-jedi-fallen-order/'
    ),
    (
        'XSX',
        17,
        '2021-06-11',
        59.99,
        'https://www.xbox.com/en-us/games/store/star-wars-jedi-fallen-order/c2csdtscbz0c'
    ),
    (
        'PS4',
        17,
        '2019-11-15',
        59.99,
        'https://www.playstation.com/en-us/games/star-wars-jedi-fallen-order/'
    ),
    (
        'XBO',
        17,
        '2019-11-15',
        59.99,
        'https://www.xbox.com/en-us/games/store/star-wars-jedi-fallen-order/c2csdtscbz0c'
    );

-- 18.Halo: Infinite | wikipedia: https://en.wikipedia.org/wiki/Halo_Infinite
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        18,
        '2021-12-08',
        59.99,
        'https://www.xbox.com/en-us/games/halo-infinite'
    ),
    (
        'XSX',
        18,
        '2021-12-08',
        59.99,
        'https://www.xbox.com/en-us/games/halo-infinite'
    ),
    (
        'XBO',
        18,
        '2021-12-08',
        59.99,
        'https://www.xbox.com/en-us/games/halo-infinite'
    );

-- 19.Resident Evil Village | wikipedia: https://en.wikipedia.org/wiki/Resident_Evil_Village
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        19,
        '2021-05-07',
        59.99,
        'https://store.steampowered.com/app/1196590/Resident_Evil_Village/'
    ),
    (
        'PS5',
        19,
        '2021-05-07',
        59.99,
        'https://www.playstation.com/en-us/games/resident-evil-village/'
    ),
    (
        'XSX',
        19,
        '2021-05-07',
        59.99,
        'https://www.xbox.com/en-us/games/store/resident-evil-village/9n2s04lgxxh4'
    ),
    (
        'PS4',
        19,
        '2021-05-07',
        59.99,
        'https://www.playstation.com/en-us/games/resident-evil-village/'
    ),
    (
        'XBO',
        19,
        '2021-05-07',
        59.99,
        'https://www.xbox.com/en-us/games/store/resident-evil-village/9n2s04lgxxh4'
    ),
    (
        'NSW',
        19,
        '2022-10-28',
        59.99,
        'https://www.nintendo.com/us/store/products/resident-evil-village-cloud-switch/'
    );

-- 20.Ghost of Tsushima | wikipedia: https://en.wikipedia.org/wiki/Ghost_of_Tsushima
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS5',
        20,
        '2021-08-20',
        59.99,
        'https://www.playstation.com/en-us/games/ghost-of-tsushima/'
    ),
    (
        'PS4',
        20,
        '2020-06-17',
        59.99,
        'https://www.playstation.com/en-us/games/ghost-of-tsushima/'
    );

-- 21.Final Fantasy VII | wikipedia: https://en.wikipedia.org/wiki/Final_Fantasy_VII
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        21,
        '2013-07-13',
        12.99,
        'https://store.steampowered.com/app/39140/FINAL_FANTASY_VII/'
    ),
    (
        'PS4',
        21,
        '2015-12-05',
        29.99,
        'https://www.playstation.com/en-us/games/final-fantasy-vii/'
    ),
    (
        'XBO',
        21,
        '2019-03-26',
        15.99,
        'https://www.xbox.com/en-us/games/store/final-fantasy-vii/bwkxqc5bl5r1'
    ),
    (
        'NSW',
        21,
        '2019-03-26',
        15.99,
        'https://www.nintendo.com/games/detail/final-fantasy-vii-switch/'
    ),
    ('PS1', 21, '1997-11-17', null, null),
    (
        'MOB',
        21,
        '2016-07-07',
        15.99,
        'https://play.google.com/store/apps/details?id=com.square_enix.android_googleplay.FFVII&hl=en&gl=US'
    );

-- 22.Death Stranding | wikipedia: https://en.wikipedia.org/wiki/Death_Stranding
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        22,
        '2020-07-14',
        59.99,
        'https://store.epicgames.com/en-US/p/death-stranding-directors-cut'
    ),
    (
        'PS5',
        22,
        '2021-09-24',
        59.99,
        'https://www.playstation.com/en-us/games/death-stranding/'
    ),
    (
        'PS4',
        22,
        '2019-11-08',
        59.99,
        'https://www.playstation.com/en-us/games/death-stranding/'
    );

-- 23.Demon's Souls | wikipedia: https://en.wikipedia.org/wiki/Demon%27s_Souls
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    ('PS3', 23, '2009-10-06', 19.99, null);

-- 24.Fallout 4 | wikipedia: https://en.wikipedia.org/wiki/Fallout_4
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        24,
        '2015-11-10',
        29.99,
        'https://store.steampowered.com/app/377160/Fallout_4/'
    ),
    (
        'PS4',
        24,
        '2015-11-10',
        29.99,
        'https://www.playstation.com/en-us/games/fallout-4/'
    ),
    (
        'XBO',
        24,
        '2015-11-10',
        29.99,
        'https://www.xbox.com/en-us/games/store/fallout-4/c3kldkzbhncz'
    );

-- 25.Genshin Impact | wikipedia: https://en.wikipedia.org/wiki/Genshin_Impact
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS4',
        25,
        '2020-09-28',
        0,
        'https://genshin.mihoyo.com/en'
    ),
    (
        'MOB',
        25,
        '2020-09-28',
        0,
        'https://genshin.mihoyo.com/en'
    ),
    (
        'PC',
        25,
        '2020-09-28',
        0,
        'https://genshin.mihoyo.com/en'
    ),
    (
        'PS5',
        25,
        '2021-04-28',
        0,
        'https://genshin.mihoyo.com/en'
    );

-- 26.Borderlands 3 | wikipedia: https://en.wikipedia.org/wiki/Borderlands_3
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        26,
        '2019-09-13',
        59.99,
        'https://store.steampowered.com/app/397540/Borderlands_3/'
    ),
    (
        'PS4',
        26,
        '2019-09-13',
        59.99,
        'https://www.playstation.com/en-us/games/borderlands-3/'
    ),
    (
        'XBO',
        26,
        '2019-09-13',
        59.99,
        'https://www.xbox.com/en-us/games/store/borderlands-3/c34nb0f1b5wq'
    ),
    (
        'NSW',
        26,
        '2023-10-06',
        59.99,
        'https://www.nintendo.com/us/store/products/borderlands-3-ultimate-edition-switch/'
    ),
    (
        'PS5',
        26,
        '2021-11-12',
        59.99,
        'https://www.playstation.com/en-us/games/borderlands-3/'
    ),
    (
        'XSX',
        26,
        '2021-11-10',
        59.99,
        'https://www.xbox.com/en-us/games/store/borderlands-3/c34nb0f1b5wq'
    );

-- 27.The Outer Worlds | wikipedia: https://en.wikipedia.org/wiki/The_Outer_Worlds
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        27,
        '2019-10-25',
        59.99,
        'https://store.steampowered.com/app/578650/The_Outer_Worlds/'
    ),
    (
        'PS5',
        27,
        '2023-03-07',
        59.99,
        'https://www.playstation.com/en-us/games/the-outer-worlds/'
    ),
    (
        'XSX',
        27,
        '2023-03-07',
        59.99,
        'https://www.xbox.com/en-us/games/store/the-outer-worlds/bvtkn6cq8w5f'
    ),
    (
        'PS4',
        27,
        '2019-10-25',
        59.99,
        'https://www.playstation.com/en-us/games/the-outer-worlds/'
    ),
    (
        'XBO',
        27,
        '2019-10-25',
        59.99,
        'https://www.xbox.com/en-us/games/store/the-outer-worlds/bvtkn6cq8w5f'
    ),
    (
        'NSW',
        27,
        '2020-06-05',
        59.99,
        'https://www.nintendo.com/games/detail/the-outer-worlds-switch/'
    );

-- 28.Control | wikipedia: https://en.wikipedia.org/wiki/Control_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        28,
        '2019-08-27',
        29.99,
        'https://store.steampowered.com/app/870780/Control_Ultimate_Edition/'
    ),
    (
        'PS5',
        28,
        '2021-02-02',
        39.99,
        'https://www.playstation.com/en-us/games/control/'
    ),
    (
        'XSX',
        28,
        '2021-02-02',
        39.99,
        'https://www.xbox.com/en-US/games/store/control/BZ6W9LRPC26W'
    ),
    (
        'PS4',
        28,
        '2019-08-27',
        29.99,
        'https://www.playstation.com/en-us/games/control/'
    ),
    (
        'XBO',
        28,
        '2019-08-27',
        29.99,
        'https://www.xbox.com/en-US/games/store/control/BZ6W9LRPC26W'
    ),
    (
        'NSW',
        28,
        '2020-10-30',
        39.99,
        'https://www.nintendo.com/games/detail/control-ultimate-edition-cloud-version-switch/'
    );

-- 29.The Medium | wikipedia: https://en.wikipedia.org/wiki/The_Medium_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        29,
        '2021-01-28',
        49.99,
        'https://store.steampowered.com/app/1293160/The_Medium/'
    ),
    ('PS5', 29, '2021-09-03', 49.99, null),
    (
        'XSX',
        29,
        '2021-01-28',
        49.99,
        'https://www.xbox.com/en-us/games/store/the-medium/9nfsr96g6k4n'
    ),
    (
        'XBO',
        29,
        '2021-01-28',
        49.99,
        'https://www.xbox.com/en-us/games/store/the-medium/9nfsr96g6k4n'
    ),
    (
        'NSW',
        29,
        '2023-06-29',
        49.99,
        'https://www.nintendo.com/us/store/products/the-medium-cloud-version-switch/'
    );

-- 30.Nioh 2 | wikipedia: https://en.wikipedia.org/wiki/Nioh_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        30,
        '2021-02-05',
        49.99,
        'https://store.steampowered.com/app/1325200/Nioh_2__The_Complete_Edition/'
    ),
    (
        'PS5',
        30,
        '2021-02-05',
        49.99,
        'https://www.playstation.com/en-us/games/nioh-2/'
    ),
    (
        'PS4',
        30,
        '2020-03-13',
        49.99,
        'https://www.playstation.com/en-us/games/nioh-2/'
    );

-- 31.Watch Dogs: Legion | wikipedia: https://en.wikipedia.org/wiki/Watch_Dogs:_Legion
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        31,
        '2020-10-29',
        59.99,
        'https://store.steampowered.com/app/1289310/Watch_Dogs_Legion/'
    ),
    (
        'PS5',
        31,
        '2020-11-12',
        59.99,
        'https://www.playstation.com/en-us/games/watch-dogs-legion/'
    ),
    (
        'XSX',
        31,
        '2020-11-10',
        59.99,
        'https://www.xbox.com/en-us/games/store/watch-dogs-legion/c1wrx8zd77m9'
    ),
    (
        'PS4',
        31,
        '2020-10-29',
        59.99,
        'https://www.playstation.com/en-us/games/watch-dogs-legion/'
    ),
    (
        'XBO',
        31,
        '2020-10-29',
        59.99,
        'https://www.xbox.com/en-us/games/store/watch-dogs-legion/c1wrx8zd77m9'
    );

-- 32.Bioshock Infinite | wikipedia: https://en.wikipedia.org/wiki/BioShock_Infinite
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        32,
        '2013-03-26',
        29.99,
        'https://store.steampowered.com/app/8870/BioShock_Infinite/'
    ),
    ('PS3', 32, '2013-03-26', 29.99, null),
    ('X360', 32, '2013-03-26', 29.99, null);

-- 33.Dying Light 2 stay human | wikipedia: https://en.wikipedia.org/wiki/Dying_Light_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        33,
        '2022-02-04',
        59.99,
        'https://store.steampowered.com/app/534380/Dying_Light_2_Stay_Human/'
    ),
    (
        'PS5',
        33,
        '2022-02-04',
        59.99,
        'https://www.playstation.com/en-us/games/dying-light-2-stay-human/'
    ),
    (
        'XSX',
        33,
        '2022-02-04',
        59.99,
        'https://www.xbox.com/en-us/games/store/dying-light-2-stay-human/bpcl0txcgj1w'
    ),
    (
        'PS4',
        33,
        '2022-02-04',
        59.99,
        'https://www.playstation.com/en-us/games/dying-light-2-stay-human/'
    ),
    (
        'XBO',
        33,
        '2022-02-04',
        59.99,
        'https://www.xbox.com/en-us/games/store/dying-light-2-stay-human/bpcl0txcgj1w'
    );

-- 34.Fall Guys: Ultimate Knockout | wikipedia: https://en.wikipedia.org/wiki/Fall_Guys
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        34,
        '2020-08-04',
        0,
        'https://store.epicgames.com/en-US/p/fall-guys'
    ),
    (
        'PS5',
        34,
        '2022-06-21',
        0,
        'https://www.playstation.com/en-us/games/fall-guys-ultimate-knockout/'
    ),
    (
        'XSX',
        34,
        '2022-06-21',
        0,
        'https://www.xbox.com/en-us/games/store/fall-guys/9pmxh5249dg5'
    ),
    (
        'PS4',
        34,
        '2020-08-04',
        0,
        'https://www.playstation.com/en-us/games/fall-guys-ultimate-knockout/'
    ),
    (
        'XBO',
        34,
        '2022-06-21',
        0,
        'https://www.xbox.com/en-us/games/store/fall-guys/9pmxh5249dg5'
    ),
    (
        'NSW',
        34,
        '2022-06-21',
        0,
        'https://www.nintendo.com/us/store/products/fall-guys-switch/'
    );

-- 35.God of War I | wikipedia: https://en.wikipedia.org/wiki/God_of_War_(2005_video_game)
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('PS2', 35, '2005-03-22'),
    ('PS3', 35, '2005-03-22'),
    ('PSV', 35, '2007-03-13');

-- 36.God of War II | wikipedia: https://en.wikipedia.org/wiki/God_of_War_II
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('PS2', 36, '2007-03-13'),
    ('PS3', 36, '2007-03-13'),
    ('PSV', 36, '2007-03-13');

-- 37.God of War: Betrayal | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Betrayal
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('MOB', 37, '2007-06-20');

-- 38.God of War: Chains of Olympus | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Chains_of_Olympus
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('PSP', 38, '2008-03-04'),
    ('PS3', 38, '2008-03-04'),
    ('PSV', 38, '2008-03-04');

-- 39.God of War III | wikipedia: https://en.wikipedia.org/wiki/God_of_War_III
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('PS3', 39, '2010-03-16');

-- 40.God of War: Ghost of Sparta | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Ghost_of_Sparta
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('PSP', 40, '2010-11-02'),
    ('PS3', 40, '2010-11-02'),
    ('PSV', 40, '2010-11-02');

-- 41.God of War: Ascension | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Ascension
INSERT INTO
    publication (platform_code, video_game_id, release_date)
VALUES
    ('PS3', 41, '2013-03-12');

-- 42.God of War | wikipedia: https://en.wikipedia.org/wiki/God_of_War_(2018_video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS4',
        42,
        '2018-04-20',
        19.99,
        'https://www.playstation.com/en-us/games/god-of-war/'
    ),
    (
        'PC',
        42,
        '2022-01-14',
        49.99,
        'https://store.steampowered.com/app/1593500/God_of_War/'
    );

-- 43.God of War: Ragnarok | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Ragnar%C3%B6k
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS5',
        43,
        '2022-11-09',
        69.99,
        'https://www.playstation.com/en-us/games/god-of-war-ragnarok/'
    ),
    (
        'PS4',
        43,
        '2022-11-09',
        69.99,
        'https://www.playstation.com/en-us/games/god-of-war-ragnarok/'
    );

-- 44 God of war III Remastered | wikipedia: https://en.wikipedia.org/wiki/God_of_War_III_Remastered
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS4',
        44,
        '2015-07-15',
        19.99,
        'https://www.playstation.com/en-us/games/god-of-war-iii-remastered/'
    );

-- 45. Stardew Valley | wikipedia: https://en.wikipedia.org/wiki/Stardew_Valley
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        45,
        '2016-02-26',
        14.99,
        'https://store.steampowered.com/app/413150/Stardew_Valley/'
    ),
    (
        'PS4',
        45,
        '2016-12-13',
        14.99,
        'https://www.playstation.com/en-us/games/stardew-valley/'
    ),
    (
        'XBO',
        45,
        '2016-12-14',
        14.99,
        'https://www.xbox.com/en-us/games/store/stardew-valley/c3d891z6tnqm'
    ),
    (
        'NSW',
        45,
        '2017-10-05',
        14.99,
        'https://www.nintendo.com/games/detail/stardew-valley-switch/'
    ),
    (
        'MOB',
        45,
        '2019-03-14',
        4.99,
        'https://play.google.com/store/apps/details?id=com.chucklefish.stardewvalley&hl=en&gl=US'
    ),
    ('PSV', 45, '2016-12-13', 14.99, null);

-- 46. Hades | wikipedia: https://en.wikipedia.org/wiki/Hades_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        46,
        '2020-09-17',
        24.99,
        'https://store.steampowered.com/app/1145360/Hades/'
    ),
    (
        'PS5',
        46,
        '2021-08-13',
        24.99,
        'https://www.playstation.com/en-us/games/hades/'
    ),
    (
        'XSX',
        46,
        '2021-08-13',
        24.99,
        'https://www.xbox.com/en-us/games/store/hades/9p8dl6w0jbb8'
    ),
    (
        'PS4',
        46,
        '2021-08-13',
        24.99,
        'https://www.playstation.com/en-us/games/hades/'
    ),
    (
        'XBO',
        46,
        '2021-08-13',
        24.99,
        'https://www.xbox.com/en-us/games/store/hades/9p8dl6w0jbb8'
    ),
    (
        'NSW',
        46,
        '2020-09-17',
        24.99,
        'https://www.nintendo.com/games/detail/hades-switch/'
    );

-- 47. Baldur's Gate 3 | wikipedia: https://en.wikipedia.org/wiki/Baldur%27s_Gate_III
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        47,
        '2023-08-03',
        59.99,
        'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/'
    ),
    (
        'PS5',
        47,
        '2023-09-06',
        69.99,
        'https://www.playstation.com/en-us/games/baldurs-gate-3/'
    );

-- 48. Monster Hunter: World | wikipedia: https://en.wikipedia.org/wiki/Monster_Hunter:_World
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        48,
        '2018-08-09',
        29.99,
        'https://store.steampowered.com/app/582010/Monster_Hunter_World/'
    ),
    (
        'PS4',
        48,
        '2018-01-26',
        29.99,
        'https://www.playstation.com/en-us/games/monster-hunter-world/'
    ),
    (
        'XBO',
        48,
        '2018-01-26',
        29.99,
        'https://www.xbox.com/en-us/games/store/monster-hunter-world/bng91pt95lqn'
    );

-- 49. Cyber Shadow | wikipedia: https://en.wikipedia.org/wiki/Cyber_Shadow
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        49,
        '2021-01-26',
        19.99,
        'https://store.steampowered.com/app/861250/Cyber_Shadow/'
    ),
    (
        'PS5',
        49,
        '2021-01-26',
        19.99,
        'https://store.playstation.com/en-us/product/UP2200-PPSA01882_00-CYBERSHADOW00001'
    ),
    (
        'XSX',
        49,
        '2021-01-26',
        19.99,
        'https://www.xbox.com/en-us/games/store/cyber-shadow/9nx9lj5jswh8'
    ),
    (
        'PS4',
        49,
        '2021-01-26',
        19.99,
        'https://store.playstation.com/en-us/product/UP2200-PPSA01882_00-CYBERSHADOW00001'
    ),
    (
        'XBO',
        49,
        '2021-01-26',
        19.99,
        'https://www.xbox.com/en-us/games/store/cyber-shadow/9nx9lj5jswh8'
    ),
    (
        'NSW',
        49,
        '2021-01-26',
        19.99,
        'https://www.nintendo.com/games/detail/cyber-shadow-switch/'
    );

-- 50. Animal Crossing: New Horizons | wikipedia: https://en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'NSW',
        50,
        '2020-03-20',
        59.99,
        'https://www.nintendo.com/games/detail/animal-crossing-new-horizons-switch/'
    );

-- 51. Tom Clancy's Rainbow Six Siege | wikipedia: https://en.wikipedia.org/wiki/Tom_Clancy%27s_Rainbow_Six_Siege
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        51,
        '2015-12-01',
        19.99,
        'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/'
    ),
    (
        'PS5',
        51,
        '2020-12-01',
        19.99,
        'https://www.playstation.com/en-us/games/tom-clancys-rainbow-six-siege/'
    ),
    (
        'XSX',
        51,
        '2020-12-01',
        19.99,
        'https://www.xbox.com/en-us/games/store/tom-clancys-rainbow-six-siege/c12t09dsvp8j'
    ),
    (
        'PS4',
        51,
        '2015-12-01',
        19.99,
        'https://www.playstation.com/en-us/games/tom-clancys-rainbow-six-siege/'
    ),
    (
        'XBO',
        51,
        '2015-12-01',
        19.99,
        'https://www.xbox.com/en-us/games/store/tom-clancys-rainbow-six-siege/c12t09dsvp8j'
    );

-- 52. Final Fantasy VII Remake | wikipedia: https://en.wikipedia.org/wiki/Final_Fantasy_VII_Remake
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS4',
        52,
        '2020-04-10',
        59.99,
        'https://www.playstation.com/en-us/games/final-fantasy-vii-remake/'
    ),
    (
        'PS5',
        52,
        '2021-06-10',
        69.99,
        'https://www.playstation.com/en-us/games/final-fantasy-vii-remake-intergrade/'
    ),
    ('PC', 52, '2021-12-06', 59.99, NULL);

-- 53. League of Legends | wikipedia: https://en.wikipedia.org/wiki/League_of_Legends
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        53,
        '2009-10-27',
        0,
        'https://play.na.leagueoflegends.com/en_US'
    );

-- 54. Apex Legends | wikipedia: https://en.wikipedia.org/wiki/Apex_Legends
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        54,
        '2019-02-04',
        0,
        'https://www.ea.com/games/apex-legends'
    ),
    (
        'PS5',
        54,
        '2022-03-29',
        0,
        'https://www.playstation.com/en-us/games/apex-legends/'
    ),
    (
        'XSX',
        54,
        '2022-03-29',
        0,
        'https://www.xbox.com/en-us/games/store/apex-legends/bv9ml45j2q5v'
    ),
    (
        'PS4',
        54,
        '2019-02-04',
        0,
        'https://www.playstation.com/en-us/games/apex-legends/'
    ),
    (
        'XBO',
        54,
        '2019-02-04',
        0,
        'https://www.xbox.com/en-us/games/store/apex-legends/bv9ml45j2q5v'
    ),
    (
        'NSW',
        54,
        '2021-03-09',
        0,
        'https://www.nintendo.com/games/detail/apex-legends-switch/'
    );

-- 55. Among Us | wikipedia: https://en.wikipedia.org/wiki/Among_Us
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        55,
        '2019-02-04',
        4.49,
        'https://store.steampowered.com/app/945360/Among_Us/'
    ),
    (
        'PS5',
        55,
        '2022-03-29',
        4.49,
        'https://www.playstation.com/en-us/games/among-us/'
    ),
    (
        'XSX',
        55,
        '2022-03-29',
        4.49,
        'https://www.xbox.com/en-us/games/store/among-us/9NG07QJNK38J'
    ),
    (
        'PS4',
        55,
        '2019-02-04',
        4.49,
        'https://www.playstation.com/en-us/games/among-us/'
    ),
    (
        'XBO',
        55,
        '2019-02-04',
        4.49,
        'https://www.xbox.com/en-us/games/store/among-us/9NG07QJNK38J'
    ),
    (
        'NSW',
        55,
        '2021-03-09',
        5.00,
        'https://www.nintendo.com/games/detail/among-us-switch/'
    ),
    (
        'MOB',
        55,
        '2022-03-17',
        0,
        'https://play.google.com/store/apps/details?id=com.innersloth.spacemafia&hl=en&gl=US'
    );

-- 56. Call of Duty: Warzone | wikipedia: https://en.wikipedia.org/wiki/Call_of_Duty:_Warzone
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        56,
        '2020-03-10',
        0,
        'https://www.callofduty.com/warzone'
    ),
    (
        'PS4',
        56,
        '2020-03-10',
        0,
        'https://www.playstation.com/en-us/games/call-of-duty-warzone/'
    ),
    (
        'XBO',
        56,
        '2020-03-10',
        0,
        'https://www.xbox.com/en-us/games/store/call-of-duty-warzone/9nnfg8bqrcxl'
    );

-- 57. Fortnite | wikipedia: https://en.wikipedia.org/wiki/Fortnite
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        57,
        '2017-07-25',
        0,
        'https://www.epicgames.com/fortnite/en-US/home'
    ),
    (
        'PS5',
        57,
        '2017-07-25',
        0,
        'https://www.playstation.com/en-us/games/fortnite/'
    ),
    (
        'XSX',
        57,
        '2017-07-25',
        0,
        'https://www.xbox.com/en-us/games/store/fortnite/bt5p2x999vh2'
    ),
    (
        'PS4',
        57,
        '2017-07-25',
        0,
        'https://www.playstation.com/en-us/games/fortnite/'
    ),
    (
        'XBO',
        57,
        '2017-07-25',
        0,
        'https://www.xbox.com/en-us/games/store/fortnite/bt5p2x999vh2'
    ),
    (
        'NSW',
        57,
        '2018-06-12',
        0,
        'https://www.nintendo.com/us/store/products/fortnite-switch/'
    ),
    ('MOB', 57, '2018-06-12', 0, null);

-- 58. Overwatch | wikipedia: https://en.wikipedia.org/wiki/Overwatch_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price
    )
VALUES
    ('PC', 58, '2016-05-24', 19.99),
    ('PS4', 58, '2016-05-24', 19.99),
    ('XBO', 58, '2016-05-24', 19.99),
    ('NSW', 58, '2019-10-15', 39.99);

-- 59. Valorant | wikipedia: https://en.wikipedia.org/wiki/Valorant
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        59,
        '2020-06-02',
        0,
        'https://playvalorant.com/en-us/'
    );

-- 60. Destiny 2 | wikipedia: https://en.wikipedia.org/wiki/Destiny_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        60,
        '2017-10-24',
        0,
        'https://www.bungie.net/7/en/Destiny/NewLight'
    ),
    (
        'PS5',
        60,
        '2020-12-08',
        0,
        'https://www.playstation.com/en-us/games/destiny-2/'
    ),
    (
        'XSX',
        60,
        '2020-12-08',
        0,
        'https://www.xbox.com/en-us/games/store/destiny-2/bpq955fqfph6'
    ),
    (
        'PS4',
        60,
        '2017-09-06',
        0,
        'https://www.playstation.com/en-us/games/destiny-2/'
    ),
    (
        'XBO',
        60,
        '2017-09-06',
        0,
        'https://www.xbox.com/en-us/games/store/destiny-2/bpq955fqfph6'
    );

-- 61. Counter-Strike: Global Offensive | wikipedia: https://en.wikipedia.org/wiki/Counter-Strike:_Global_Offensive
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        61,
        '2012-08-21',
        0,
        'https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/'
    );

-- 62. Rocket League | wikipedia: https://en.wikipedia.org/wiki/Rocket_League
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        62,
        '2015-07-07',
        0,
        'https://store.epicgames.com/en-US/p/rocket-league'
    ),
    (
        'PS5',
        62,
        '2015-07-07',
        0,
        'https://www.playstation.com/en-us/games/rocket-league/'
    ),
    (
        'XSX',
        62,
        '2015-07-07',
        0,
        'https://www.xbox.com/en-us/games/store/rocket-league/c125w9bg2k0v'
    ),
    (
        'PS4',
        62,
        '2015-07-07',
        0,
        'https://www.playstation.com/en-us/games/rocket-league/'
    ),
    (
        'XBO',
        62,
        '2015-07-07',
        0,
        'https://www.xbox.com/en-us/games/store/rocket-league/c125w9bg2k0v'
    ),
    (
        'NSW',
        62,
        '2015-07-07',
        0,
        'https://www.nintendo.com/games/detail/rocket-league-switch/'
    );

-- 63. Sea of Thieves | wikipedia: https://en.wikipedia.org/wiki/Sea_of_Thieves
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        63,
        '2018-03-20',
        0,
        'https://www.seaofthieves.com/en'
    ),
    (
        'XSX',
        63,
        '2020-11-10',
        0,
        'https://www.xbox.com/en-us/games/store/sea-of-thieves/9p2n57mc619k'
    ),
    (
        'XBO',
        63,
        '2018-03-20',
        0,
        'https://www.xbox.com/en-us/games/store/sea-of-thieves/9p2n57mc619k'
    );

-- 64. World of Warcraft | wikipedia: https://en.wikipedia.org/wiki/World_of_Warcraft
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        64,
        '2004-11-23',
        0,
        'https://worldofwarcraft.com/en-us/'
    );

-- 65. Dead by Daylight | wikipedia: https://en.wikipedia.org/wiki/Dead_by_Daylight
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        65,
        '2016-06-14',
        19.99,
        'https://store.steampowered.com/app/381210/Dead_by_Daylight/'
    ),
    (
        'PS5',
        65,
        '2020-11-19',
        29.99,
        'https://www.playstation.com/en-us/games/dead-by-daylight/'
    ),
    (
        'XSX',
        65,
        '2020-11-10',
        29.99,
        'https://www.xbox.com/en-us/games/store/dead-by-daylight/c0n22p73qz60'
    ),
    (
        'PS4',
        65,
        '2017-06-23',
        29.99,
        'https://www.playstation.com/en-us/games/dead-by-daylight/'
    ),
    (
        'XBO',
        65,
        '2017-06-23',
        29.99,
        'https://www.xbox.com/en-us/games/store/dead-by-daylight/c0n22p73qz60'
    ),
    (
        'NSW',
        65,
        '2019-09-24',
        29.99,
        'https://www.nintendo.com/games/detail/dead-by-daylight-switch/'
    ),
    (
        'MOB',
        65,
        '2020-04-16',
        0,
        'https://play.google.com/store/apps/details?id=com.netease.dbdena&hl=en&gl=US'
    );

-- 66. Phasmophobia | wikipedia: https://en.wikipedia.org/wiki/Phasmophobia_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        66,
        '2020-09-18',
        13.99,
        'https://store.steampowered.com/app/739630/Phasmophobia/'
    );

-- 67. The Sims 4 | wikipedia: https://en.wikipedia.org/wiki/The_Sims_4
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        67,
        '2014-09-04',
        39.99,
        'https://store.steampowered.com/app/1222670/The_Sims_4_Snowy_Escape/'
    ),
    (
        'PS4',
        67,
        '2017-11-17',
        39.99,
        'https://www.playstation.com/en-us/games/the-sims-4/'
    ),
    (
        'XBO',
        67,
        '2017-11-17',
        39.99,
        'https://www.xbox.com/en-us/games/store/the-sims-4/c08jxnk0vg5l'
    );

-- 68. Rust | wikipedia: https://en.wikipedia.org/wiki/Rust_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        68,
        '2018-02-08',
        39.99,
        'https://store.steampowered.com/app/252490/Rust/'
    ),
    (
        'PS4',
        68,
        '2021-05-21',
        39.99,
        'https://www.playstation.com/en-us/games/rust/'
    ),
    (
        'XBO',
        68,
        '2021-05-21',
        0,
        'https://www.xbox.com/en-us/games/store/rust/9nphhzbv60b4'
    );

-- 69. RuneScape | wikipedia: https://en.wikipedia.org/wiki/RuneScape
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        69,
        '2001-01-04',
        0,
        'https://www.runescape.com/'
    ),
    (
        'MOB',
        69,
        '2001-01-04',
        0,
        'https://play.google.com/store/apps/details?id=com.jagex.runescape.android&hl=en&gl=US'
    );

-- 70. Path of Exile | wikipedia: https://en.wikipedia.org/wiki/Path_of_Exile
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        70,
        '2013-10-23',
        0,
        'https://store.steampowered.com/app/238960/Path_of_Exile/'
    ),
    (
        'PS4',
        70,
        '2019-03-26',
        0,
        'https://www.playstation.com/en-us/games/path-of-exile/'
    ),
    (
        'XBO',
        70,
        '2017-08-24',
        0,
        'https://www.xbox.com/en-us/games/store/path-of-exile/BWC95BZPFBS7'
    );

-- 71. World of Tanks | wikipedia: https://en.wikipedia.org/wiki/World_of_Tanks
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        71,
        '2011-04-12',
        0,
        'https://worldoftanks.com/en/'
    ),
    (
        'PS5',
        71,
        '2021-10-26',
        0,
        'https://www.playstation.com/en-us/games/world-of-tanks/'
    ),
    (
        'PS4',
        71,
        '2016-01-19',
        0,
        'https://www.playstation.com/en-us/games/world-of-tanks/'
    ),
    (
        'XBO',
        71,
        '2015-07-28',
        0,
        'https://www.xbox.com/en-us/games/store/world-of-tanks/c57l9gr0hhb7'
    ),
    ('X360', 71, '2014-02-12', 0, null),
    (
        'NSW',
        71,
        '2019-09-25',
        0,
        'https://www.nintendo.com/games/detail/world-of-tanks-blitz-switch/'
    );

-- 72. Warframe | wikipedia: https://en.wikipedia.org/wiki/Warframe
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        72,
        '2013-03-25',
        0,
        'https://store.steampowered.com/app/230410/Warframe/'
    ),
    (
        'PS5',
        72,
        '2020-11-26',
        0,
        'https://www.playstation.com/en-us/games/warframe/'
    ),
    (
        'XSX',
        72,
        '2021-04-14',
        0,
        'https://www.xbox.com/en-us/games/store/warframe/BPS3XF74B9V1'
    ),
    (
        'PS4',
        72,
        '2013-11-29',
        0,
        'https://www.playstation.com/en-us/games/warframe/'
    ),
    (
        'XBO',
        72,
        '2014-09-02',
        0,
        'https://www.xbox.com/en-us/games/store/warframe/BPS3XF74B9V1'
    ),
    (
        'NSW',
        72,
        '2018-11-20',
        0,
        'https://www.nintendo.com/games/detail/warframe-switch/'
    );

-- 73. Team Fortress 2 | wikipedia: https://en.wikipedia.org/wiki/Team_Fortress_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        73,
        '2007-10-18',
        0,
        'https://store.steampowered.com/app/440/Team_Fortress_2/'
    ),
    ('PS3', 73, '2007-11-23', 0, null),
    ('XBO', 73, '2007-10-18', 0, null);

-- 74. Dota 2 | wikipedia: https://en.wikipedia.org/wiki/Dota_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        74,
        '2013-07-09',
        0,
        'https://store.steampowered.com/app/570/Dota_2/'
    );

-- 75. SMITE | wikipedia: https://en.wikipedia.org/wiki/Smite_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        75,
        '2014-03-25',
        0,
        'https://store.steampowered.com/app/386360/SMITE/'
    ),
    (
        'PS4',
        75,
        '2016-05-31',
        0,
        'https://www.playstation.com/en-us/games/smite/'
    ),
    (
        'XBO',
        75,
        '2015-08-19',
        0,
        'https://www.xbox.com/en-us/games/store/smite/c2mhs238pdns'
    ),
    (
        'NSW',
        75,
        '2019-02-18',
        0,
        'https://www.nintendo.com/games/detail/smite-switch/'
    );

-- 76. Guild Wars 2 | wikipedia: https://en.wikipedia.org/wiki/Guild_Wars_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        76,
        '2012-08-28',
        0,
        'https://www.guildwars2.com/en/'
    );

-- 77. Arma 3 | wikipedia: https://en.wikipedia.org/wiki/Arma_3
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        77,
        '2013-09-12',
        29.99,
        'https://store.steampowered.com/app/107410/Arma_3/'
    );

-- 78. Outlast | wikipedia: https://en.wikipedia.org/wiki/Outlast_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        78,
        '2013-09-04',
        19.99,
        'https://store.steampowered.com/app/238320/Outlast/'
    ),
    (
        'PS4',
        78,
        '2014-02-05',
        19.99,
        'https://www.playstation.com/en-us/games/outlast/'
    ),
    (
        'XBO',
        78,
        '2014-06-19',
        19.99,
        'https://www.xbox.com/en-us/games/store/outlast/bp3gh4d3hp2h'
    ),
    (
        'NSW',
        78,
        '2018-02-27',
        24.99,
        'https://www.nintendo.com/games/detail/outlast-switch/'
    );

-- 79. The Forest | wikipedia: https://en.wikipedia.org/wiki/The_Forest_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        79,
        '2018-04-30',
        19.99,
        'https://store.steampowered.com/app/242760/The_Forest/'
    ),
    (
        'PS4',
        79,
        '2018-11-06',
        19.99,
        'https://www.playstation.com/en-us/games/the-forest/'
    );

-- 80. Left 4 Dead 2 | wikipedia: https://en.wikipedia.org/wiki/Left_4_Dead_2
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        80,
        '2009-11-17',
        9.99,
        'https://store.steampowered.com/app/550/Left_4_Dead_2/'
    ),
    ('X360', 80, '2009-11-17', 9.99, null);

-- 81. Among the Sleep | wikipedia: https://en.wikipedia.org/wiki/Among_the_Sleep
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        81,
        '2014-05-29',
        16.99,
        'https://store.steampowered.com/app/250620/Among_the_Sleep__Enhanced_Edition/'
    ),
    (
        'XBO',
        81,
        '2016-06-03',
        16.99,
        'https://www.xbox.com/en-us/games/store/among-the-sleep-enhanced-edition/c3k10n1vqtnb'
    ),
    (
        'PS4',
        81,
        '2015-12-10',
        16.99,
        'https://www.playstation.com/en-us/games/among-the-sleep-enhanced-edition/'
    ),
    (
        'NSW',
        81,
        '2019-05-29',
        19.99,
        'https://www.nintendo.com/games/detail/among-the-sleep-enhanced-edition-switch/'
    );

-- 82. Alien: Isolation | wikipedia: https://en.wikipedia.org/wiki/Alien:_Isolation
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        82,
        '2014-10-06',
        39.99,
        'https://store.steampowered.com/app/214490/Alien_Isolation/'
    ),
    (
        'PS4',
        82,
        '2014-10-06',
        39.99,
        'https://www.playstation.com/en-us/games/alien-isolation/'
    ),
    (
        'XBO',
        82,
        '2014-10-06',
        39.99,
        'https://www.xbox.com/en-us/games/store/alien-isolation/c1h9v6slk2k5'
    ),
    ('PS3', 82, '2014-10-06', 39.99, null),
    ('X360', 82, '2014-10-06', 39.99, null),
    (
        'NSW',
        82,
        '2019-12-05',
        34.99,
        'https://www.nintendo.com/games/detail/alien-isolation-switch/'
    ),
    (
        'MOB',
        82,
        '2021-04-13',
        0,
        'https://play.google.com/store/apps/details?id=com.feralinteractive.alienisolation_android&hl=en&gl=US'
    );

-- 83. Amnesia: The Dark Descent | wikipedia: https://en.wikipedia.org/wiki/Amnesia:_The_Dark_Descent
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        83,
        '2010-09-08',
        19.99,
        'https://store.steampowered.com/app/57300/Amnesia_The_Dark_Descent/'
    ),
    ('PS4', 83, '2016-11-22', 19.99, null),
    ('XBO', 83, '2018-11-28', 19.99, null),
    ('NSW', 83, '2021-09-28', 29.99, null),
    ('MOB', 83, '2020-09-15', 0, null);

-- 84. The Evil Within | wikipedia: https://en.wikipedia.org/wiki/The_Evil_Within
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        84,
        '2014-10-14',
        19.99,
        'https://store.steampowered.com/app/268050/The_Evil_Within/'
    ),
    (
        'PS4',
        84,
        '2014-10-14',
        19.99,
        'https://www.playstation.com/en-us/games/the-evil-within/'
    ),
    (
        'XBO',
        84,
        '2014-10-14',
        19.99,
        'https://www.xbox.com/en-us/games/store/the-evil-within/c2m8hbnvpt1t'
    ),
    ('PS3', 84, '2014-10-14', 19.99, null),
    ('X360', 84, '2014-10-14', 19.99, null);

-- 85. Dead Space | wikipedia: https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        85,
        '2008-10-24',
        19.99,
        'https://store.steampowered.com/app/17470/Dead_Space/'
    ),
    ('PS3', 85, '2008-10-24', 19.99, null),
    ('X360', 85, '2008-10-24', 19.99, null);

-- 86. Dark Souls | wikipedia: https://en.wikipedia.org/wiki/Dark_Souls_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    ('PC', 86, '2011-10-07', 19.99, null),
    ('PS3', 86, '2012-09-22', 19.99, null),
    ('X360', 86, '2012-09-22', 19.99, null);

-- 87. Dark Souls II | wikipedia: https://en.wikipedia.org/wiki/Dark_Souls_II
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        87,
        '2014-04-24',
        39.99,
        'https://store.steampowered.com/app/236430/DARK_SOULS_II/'
    ),
    ('PS3', 87, '2014-03-11', 39.99, null),
    ('X360', 87, '2014-03-11', 39.99, null);

-- 88. Dark Souls III | wikipedia: https://en.wikipedia.org/wiki/Dark_Souls_III
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        88,
        '2016-04-12',
        59.99,
        'https://store.steampowered.com/app/374320/DARK_SOULS_III/'
    ),
    (
        'PS4',
        88,
        '2016-04-12',
        59.99,
        'https://www.playstation.com/en-us/games/dark-souls-iii-ps4/'
    ),
    (
        'XBO',
        88,
        '2016-04-12',
        59.99,
        'https://www.xbox.com/en-US/games/store/dark-souls-iii/BW2XDRNSCCPZ'
    );

-- 89. Bloodborne | wikipedia: https://en.wikipedia.org/wiki/Bloodborne
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PS4',
        89,
        '2015-03-25',
        19.99,
        'https://www.playstation.com/en-us/games/bloodborne-ps4/'
    );

-- 90. The Surge | wikipedia: https://en.wikipedia.org/wiki/The_Surge_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        90,
        '2017-05-16',
        14.99,
        'https://store.steampowered.com/app/378540/The_Surge/'
    ),
    ('PS4', 90, '2017-05-16', 19.99, null),
    (
        'XBO',
        90,
        '2017-05-16',
        19.99,
        'https://www.xbox.com/en-us/games/store/the-surge/brkvpthjw525'
    );

-- 91. Lords of the Fallen | wikipedia: https://en.wikipedia.org/wiki/Lords_of_the_Fallen_(2023_video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        91,
        '2014-10-13',
        59.99,
        'https://store.steampowered.com/app/1501750/Lords_of_the_Fallen/'
    ),
    (
        'PS5',
        91,
        '2014-10-13',
        79.99,
        'https://www.playstation.com/en-us/games/lords-of-the-fallen/'
    ),
    (
        'XSX',
        91,
        '2014-10-13',
        79.99,
        'https://www.xbox.com/en-us/games/store/lords-of-the-fallen/9n3cjz3hfhtf'
    );

-- 92. Salt and Sanctuary | wikipedia: https://en.wikipedia.org/wiki/Salt_and_Sanctuary
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        92,
        '2016-05-17',
        17.99,
        'https://store.steampowered.com/app/283640/Salt_and_Sanctuary/'
    ),
    (
        'PS4',
        92,
        '2016-03-15',
        17.99,
        'https://www.playstation.com/en-us/games/salt-and-sanctuary-ps4/'
    ),
    (
        'XBO',
        92,
        '2019-02-09',
        17.99,
        'https://www.xbox.com/en-us/games/store/salt-and-sanctuary/c4v7cd6w5tsk'
    ),
    ('PSV', 92, '2017-03-28', 17.99, null),
    (
        'NSW',
        92,
        '2018-08-02',
        17.99,
        'https://www.nintendo.com/games/detail/salt-and-sanctuary-switch/'
    );

-- 93. Hollow Knight | wikipedia: https://en.wikipedia.org/wiki/Hollow_Knight
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        93,
        '2017-02-24',
        14.99,
        'https://store.steampowered.com/app/367520/Hollow_Knight/'
    ),
    (
        'PS4',
        93,
        '2018-09-25',
        14.99,
        'https://www.playstation.com/en-us/games/hollow-knight-voidheart-edition/'
    ),
    (
        'XBO',
        93,
        '2018-09-25',
        14.99,
        'https://www.xbox.com/en-us/games/store/hollow-knight-voidheart-edition/9mw9469v91lm'
    ),
    (
        'NSW',
        93,
        '2018-06-12',
        14.99,
        'https://www.nintendo.com/games/detail/hollow-knight-switch/'
    );

-- 94. Ashen | wikipedia: https://en.wikipedia.org/wiki/Ashen_(2018_video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        94,
        '2018-12-07',
        39.99,
        'https://store.steampowered.com/app/649950/Ashen/'
    ),
    (
        'PS4',
        94,
        '2019-12-09',
        39.99,
        'https://www.playstation.com/en-us/games/ashen-ps4/'
    ),
    (
        'XBO',
        94,
        '2018-12-07',
        39.99,
        'https://www.xbox.com/en-us/games/store/ashen/bnxlppcvs0hn'
    ),
    (
        'NSW',
        94,
        '2019-12-09',
        39.99,
        'https://www.nintendo.com/games/detail/ashen-switch/'
    );

-- 95. Nioh | wikipedia: https://en.wikipedia.org/wiki/Nioh
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        95,
        '2017-11-07',
        49.99,
        'https://store.steampowered.com/app/485510/Nioh_Complete_Edition___Complete_Edition/'
    ),
    (
        'PS5',
        95,
        '2021-02-05',
        49.99,
        'https://www.playstation.com/en-us/games/nioh-ps4/'
    ),
    (
        'PS4',
        95,
        '2017-02-08',
        49.99,
        'https://www.playstation.com/en-us/games/nioh-ps4/'
    );

-- 96. Code Vein | wikipedia: https://en.wikipedia.org/wiki/Code_Vein
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        96,
        '2019-09-27',
        49.99,
        'https://store.steampowered.com/app/678960/CODE_VEIN/'
    ),
    (
        'PS4',
        96,
        '2019-09-27',
        59.99,
        'https://www.playstation.com/en-us/games/code-vein-ps4/'
    ),
    (
        'XBO',
        96,
        '2019-09-27',
        59.99,
        'https://www.xbox.com/en-us/games/store/code-vein/c4q7k19q0vbz'
    );

-- 97. Remnant: From the Ashes | wikipedia: https://en.wikipedia.org/wiki/Remnant:_From_the_Ashes
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        97,
        '2019-08-20',
        39.99,
        'https://store.steampowered.com/app/617290/Remnant_From_the_Ashes/'
    ),
    (
        'PS4',
        97,
        '2019-08-20',
        39.99,
        'https://www.playstation.com/en-us/games/remnant-from-the-ashes-ps4/'
    ),
    (
        'XBO',
        97,
        '2019-08-20',
        39.99,
        'https://www.xbox.com/fr-BE/games/store/remnant-from-the-ashes/9PBHXGWZTS2N/0010'
    ),
    (
        'NSW',
        97,
        '2023-03-21',
        39.99,
        'https://www.nintendo.com/games/detail/remnant-from-the-ashes-switch/'
    );

-- 98. Blasphemous | wikipedia: https://en.wikipedia.org/wiki/Blasphemous_(video_game)
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        98,
        '2019-09-10',
        24.99,
        'https://store.steampowered.com/app/774361/Blasphemous/'
    ),
    (
        'PS4',
        98,
        '2019-09-10',
        24.99,
        'https://www.playstation.com/en-us/games/blasphemous-ps4/'
    ),
    (
        'XBO',
        98,
        '2019-09-10',
        24.99,
        'https://www.xbox.com/en-us/games/store/blasphemous/9p0478ztxlz4'
    ),
    (
        'NSW',
        98,
        '2019-09-10',
        24.99,
        'https://www.nintendo.com/games/detail/blasphemous-switch/'
    );

-- 99. Mortal Shell | wikipedia: https://en.wikipedia.org/wiki/Mortal_Shell
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        99,
        '2020-08-18',
        29.99,
        'https://store.steampowered.com/app/1110910/Mortal_Shell/'
    ),
    (
        'PS4',
        99,
        '2020-08-18',
        29.99,
        'https://www.playstation.com/en-us/games/mortal-shell/'
    ),
    (
        'XBO',
        99,
        '2020-08-18',
        29.99,
        'https://www.xbox.com/en-us/games/store/mortal-shell-enhanced-edition/9pc2bjdxr2lk'
    ),
    (
        'XSX',
        99,
        '2021-03-04',
        29.99,
        'https://www.xbox.com/en-us/games/store/mortal-shell-enhanced-edition/9pc2bjdxr2lk'
    ),
    (
        'NSW',
        99,
        '2022-12-19',
        29.99,
        'https://www.nintendo.com/us/store/products/mortal-shell-complete-edition-switch/'
    ),
    (
        'PS5',
        99,
        '2021-03-04',
        29.99,
        'https://www.playstation.com/en-us/games/mortal-shell/'
    );

-- 100. Elden Ring | wikipedia: https://en.wikipedia.org/wiki/Elden_Ring
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        100,
        '2022-02-25',
        59.99,
        'https://store.steampowered.com/app/1245620/ELDEN_RING/'
    ),
    (
        'PS5',
        100,
        '2022-02-25',
        59.99,
        'https://www.playstation.com/en-us/games/elden-ring/'
    ),
    (
        'XSX',
        100,
        '2022-02-25',
        59.99,
        'https://www.xbox.com/en-us/games/store/elden-ring/9p3j32ctxlrz'
    ),
    (
        'PS4',
        100,
        '2022-02-25',
        59.99,
        'https://www.playstation.com/en-us/games/elden-ring/'
    ),
    (
        'XBO',
        100,
        '2022-02-25',
        59.99,
        'https://www.xbox.com/en-us/games/store/elden-ring/9p3j32ctxlrz'
    );

-- 101. Bloons TD 6 | wikipedia: https://en.wikipedia.org/wiki/Bloons_TD_6
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'PC',
        101,
        '2018-12-17',
        9.99,
        'https://store.steampowered.com/app/960090/Bloons_TD_6/'
    ),
    (
        'MOB',
        101,
        '2018-06-13',
        0,
        'https://play.google.com/store/apps/details?id=com.ninjakiwi.bloonstd6&hl=en_US&gl=US'
    ),
    (
        'XBO',
        101,
        '2023-09-05',
        0,
        'https://www.xbox.com/en-us/games/store/bloons-td-6/9phkz9xt6f85'
    ),
    (
        'XSX',
        101,
        '2023-09-05',
        0,
        'https://www.xbox.com/en-us/games/store/bloons-td-6/9phkz9xt6f85'
    );

-- 102. Squewe Run
INSERT INTO
    publication (
        platform_code,
        video_game_id,
        release_date,
        release_price,
        store_page_url
    )
VALUES
    (
        'MOB',
        102,
        '2023-12-01',
        0,
        'https://play.google.com/store/apps/details?id=com.tapmen.squewegame&hl=en_US&gl=US'
    );

-- Game 1: Call of Duty: Black Ops Cold War
-- Genres: FPS, Action, War, Narrative
-- Additional Categories: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 1),
    -- FPS
    (10, 1),
    -- Action
    (32, 1),
    -- War
    (29, 1),
    -- Narrative
    (50, 1),
    -- Multiplayer
    (9, 1),
    -- Co-op
    (51, 1);

-- Solo
-- Game 2: FIFA 21
-- Genres: Sports
-- Additional Category: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (37, 2),
    -- Sports
    (50, 2),
    -- Multiplayer
    (9, 2),
    -- Co-op
    (51, 2);

-- Solo
-- Game 3: The Legend of Zelda: Breath of the Wild
-- Genres: Action-Adventure, Open World, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 3),
    -- Action-Adventure
    (10, 3),
    -- Action
    (28, 3),
    -- Adventure
    (1, 3),
    -- Open World
    (2, 3),
    -- Fantasy
    (51, 3);

-- Solo
-- Game 4: Cyberpunk 2077
-- Genres: Action-Adventure, RPG, Cyberpunk, Open World, FPS, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 4),
    -- Action-Adventure
    (10, 4),
    -- Action
    (28, 4),
    -- Adventure
    (31, 4),
    -- RPG
    (3, 4),
    -- Cyberpunk
    (1, 4),
    -- Open World
    (11, 4),
    -- FPS
    (29, 4),
    -- Narrative
    (51, 4);

-- Solo
-- Game 5: Red Dead Redemption 2
-- Genres: Action-Adventure, Western, Open World, Narrative, TPS, FPS
-- Additional Category: Solo, Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 5),
    -- Action-Adventure
    (10, 5),
    -- Action
    (28, 5),
    -- Adventure
    (2, 5),
    -- Western
    (1, 5),
    -- Open World
    (29, 5),
    -- Narrative
    (12, 5),
    -- TPS
    (11, 5),
    -- FPS
    (50, 5),
    -- Multiplayer
    (9, 5),
    -- Co-op
    (51, 5);

-- Solo
-- Game 6: The Witcher 3: Wild Hunt
-- Genres: Action-Adventure, RPG, Fantasy, Open World, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 6),
    -- Action-Adventure
    (10, 6),
    -- Action
    (28, 6),
    -- Adventure
    (31, 6),
    -- RPG
    (2, 6),
    -- Fantasy
    (1, 6),
    -- Open World
    (29, 6),
    -- Narrative
    (51, 6);

-- Solo
-- Game 7: Grand Theft Auto V
-- Genres: Action-Adventure, Open World, TPS, FPS, Narrative
-- Additional Categories: Multiplayer, Solo, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 7),
    -- Action-Adventure
    (10, 7),
    -- Action
    (28, 7),
    -- Adventure
    (1, 7),
    -- Open World
    (12, 7),
    -- TPS
    (11, 7),
    -- FPS
    (29, 7),
    -- Narrative
    (50, 7),
    -- Multiplayer
    (9, 7),
    -- Co-op
    (51, 7);

-- Solo
-- Game 8: Call of Duty: Modern Warfare
-- Genres: FPS, Action, War, Narrative
-- Additional Categories: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 8),
    -- FPS
    (10, 8),
    -- Action
    (32, 8),
    -- War
    (29, 8),
    -- Narrative
    (50, 8),
    -- Multiplayer
    (9, 8),
    -- Co-op
    (51, 8);

-- Solo
-- Game 9: Minecraft
-- Genres: Sandbox, Survival, Open World, Building
-- Additional Categories: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (24, 9),
    -- Sandbox
    (14, 9),
    -- Survival
    (1, 9),
    -- Open World
    (23, 9),
    -- Building
    (50, 9),
    -- Multiplayer
    (9, 9),
    -- Co-op
    (51, 9);

-- Solo
-- Game 10: Assassin's Creed Valhalla
-- Genres: Action-Adventure, RPG, Historical, Open World, Stealth, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 10),
    -- Action-Adventure
    (10, 10),
    -- Action
    (28, 10),
    -- Adventure
    (31, 10),
    -- RPG
    (5, 10),
    -- Historical
    (1, 10),
    -- Open World
    (13, 10),
    -- Stealth
    (29, 10),
    -- Narrative
    (51, 10);

-- Solo
-- Game 11: Super Mario Odyssey
-- Genres: Platform, Action-Adventure
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (40, 11),
    -- Platform
    (27, 11),
    -- Action-Adventure
    (10, 11),
    -- Action
    (28, 11),
    -- Adventure
    (51, 11);

-- Solo
-- Game 12: The Elder Scrolls V: Skyrim
-- Genres: Action-Adventure, RPG, Fantasy, Open World, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 12),
    -- Action-Adventure
    (10, 12),
    -- Action
    (28, 12),
    -- Adventure
    (31, 12),
    -- RPG
    (2, 12),
    -- Fantasy
    (1, 12),
    -- Open World
    (29, 12),
    -- Narrative
    (51, 12);

-- Solo
-- Game 13: Sekiro: Shadows Die Twice
-- Genres: Action-Adventure, Souls-like
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 13),
    -- Action-Adventure
    (10, 13),
    -- Action
    (28, 13),
    -- Adventure
    (6, 13),
    -- Souls-like
    (51, 13);

-- Solo
-- Game 14: Horizon Zero Dawn
-- Genres: Action-Adventure, RPG, Open World, Sci-Fi, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 14),
    -- Action-Adventure
    (10, 14),
    -- Action
    (28, 14),
    -- Adventure
    (31, 14),
    -- RPG
    (1, 14),
    -- Open World
    (47, 14),
    -- Sci-Fi
    (29, 14),
    -- Narrative
    (51, 14);

-- Solo
-- Game 15: Doom Eternal
-- Genres: FPS, Action-Adventure, Sci-Fi
-- Additional Category: Multiplayer, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 15),
    -- FPS
    (27, 15),
    -- Action-Adventure
    (10, 15),
    -- Action
    (28, 15),
    -- Adventure
    (47, 15),
    -- Sci-Fi
    (50, 15),
    -- Multiplayer
    (51, 15);

-- Solo
-- Game 16: The Last of Us Part II
-- Genres: Action-Adventure, Horror, Narrative, Survival Horror, TPS
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 16),
    -- Action-Adventure
    (8, 16),
    -- Horror
    (29, 16),
    -- Narrative
    (46, 16),
    -- Survival Horror
    (12, 16),
    -- TPS
    (51, 16);

-- Solo
-- Game 17: Star Wars Jedi: Fallen Order
-- Genres: Action-Adventure, Souls-like, Sci-Fi, Narrative, Metroidvania
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 17),
    -- Action-Adventure
    (10, 17),
    -- Action
    (28, 17),
    -- Adventure
    (6, 17),
    -- Souls-like
    (47, 17),
    -- Sci-Fi
    (29, 17),
    -- Narrative
    (16, 17),
    -- Metroidvania
    (51, 17);

-- Solo
-- Game 18: Halo: Infinite
-- Genres: FPS, Action, Sci-Fi, War
-- Additional Categories: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 18),
    -- FPS
    (10, 18),
    -- Action
    (47, 18),
    -- Sci-Fi
    (32, 18),
    -- War
    (50, 18),
    -- Multiplayer
    (9, 18),
    -- Co-op
    (51, 18);

-- Solo
-- Game 19: Resident Evil Village
-- Genres: Horror, Survival Horror, FPS, Action-Adventure, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 19),
    -- Horror
    (46, 19),
    -- Survival Horror
    (11, 19),
    -- FPS
    (27, 19),
    -- Action-Adventure
    (10, 19),
    -- Action
    (28, 19),
    -- Adventure
    (29, 19),
    -- Narrative
    (51, 19);

-- Solo
-- Game 20: Ghost of Tsushima
-- Genres: Action-Adventure, Historical, Open World, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 20),
    -- Action-Adventure
    (5, 20),
    -- Historical
    (1, 20),
    -- Open World
    (29, 20),
    -- Narrative
    (51, 20);

-- Solo
-- Game 21: Final Fantasy VII
-- Genres: RPG, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (31, 21),
    -- RPG
    (2, 21),
    -- Fantasy
    (51, 21);

-- Solo
-- Game 22: Death Stranding
-- Genres: Action-Adventure, Sci-Fi, Open World, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 22),
    -- Action-Adventure
    (10, 22),
    -- Action
    (28, 22),
    -- Adventure
    (47, 22),
    -- Sci-Fi
    (1, 22),
    -- Open World
    (29, 22),
    -- Narrative
    (51, 22);

-- Solo
-- Game 23: Demon's Souls
-- Genres: Fantasy, Souls-like, Action-Adventure, RPG
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (2, 23),
    -- Fantasy
    (6, 23),
    -- Souls-like
    (27, 23),
    -- Action-Adventure
    (10, 23),
    -- Action
    (28, 23),
    -- Adventure
    (31, 23),
    -- RPG
    (51, 23);

-- Solo
-- Game 24: Fallout 4
-- Genres: Action-Adventure, RPG, Open World, Post-Apocalyptic
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 24),
    -- Action-Adventure
    (10, 24),
    -- Action
    (28, 24),
    -- Adventure
    (31, 24),
    -- RPG
    (1, 24),
    -- Open World
    (7, 24),
    -- Post-Apocalyptic
    (51, 24);

-- Solo
-- Game 25: Genshin Impact
-- Genres: Fantasy, Open World, Action-Adventure, RPG
-- Additional Category: Solo, Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (2, 25),
    -- Fantasy
    (1, 25),
    -- Open World
    (27, 25),
    -- Action-Adventure
    (10, 25),
    -- Action
    (28, 25),
    -- Adventure
    (31, 25),
    -- RPG
    (51, 25),
    -- Solo
    (50, 25),
    -- Multiplayer
    (9, 25);

-- Co-op
-- Game 26: Borderlands 3
-- Genres: FPS, Action, RPG, Sci-Fi
-- Additional Category: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 26),
    -- FPS
    (10, 26),
    -- Action
    (31, 26),
    -- RPG
    (47, 26),
    -- Sci-Fi
    (9, 26),
    -- Co-op
    (50, 26),
    -- Multiplayer
    (51, 26);

-- Solo
-- Game 27: The Outer Worlds
-- Genres: Sci-Fi, Action, RPG
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (47, 27),
    -- Sci-Fi
    (10, 27),
    -- Action
    (31, 27),
    -- RPG
    (51, 27);

-- Solo
-- Game 28: Control
-- Genres: Action-Adventure, TPS, Horror, Metroidvania, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 28),
    -- Action-Adventure
    (10, 28),
    -- Action
    (28, 28),
    -- Adventure
    (12, 28),
    -- TPS
    (8, 28),
    -- Horror
    (16, 28),
    -- Metroidvania
    (29, 28),
    -- Narrative
    (51, 28);

-- Solo
-- Game 29: The Medium
-- Genres: Horror, Survival Horror, Narrative
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 29),
    -- Horror
    (46, 29),
    -- Survival Horror
    (29, 29),
    -- Narrative
    (51, 29);

-- Solo
-- Game 30: Nioh 2
-- Genres: Fantasy, Souls-like, Action, RPG
-- Additional Category: Multiplayer, Co-op, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (2, 30),
    -- Fantasy
    (6, 30),
    -- Souls-like
    (50, 30),
    -- Multiplayer
    (9, 30),
    -- Co-op
    (10, 30),
    -- Action
    (31, 30),
    -- RPG
    (51, 30);

-- Solo
-- Game 31: Watch Dogs: Legion
-- Genres: Action-Adventure, Open World
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 31),
    -- Action-Adventure
    (31, 31),
    -- RPG
    (10, 31),
    -- Action
    (28, 31),
    -- Adventure
    (12, 31),
    -- TPS
    (1, 31),
    -- Open World
    (51, 31);

-- Solo
-- Game 32: Bioshock Infinite
-- Genres: FPS, Action
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 32),
    -- FPS
    (10, 32),
    -- Action
    (29, 32),
    -- Narrative
    (51, 32);

-- Solo
-- Game 33: Dying Light 2 Stay Human
-- Genres: Horror, Survival Horror
-- Additional Categories: Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 33),
    -- Open-world
    (7, 33),
    -- Post-apocalyptic
    (8, 33),
    -- Horror
    (46, 33),
    -- Survival Horror
    (50, 33),
    -- Multiplayer
    (9, 33);

-- Co-op
-- Game 34: Fall Guys: Ultimate Knockout
-- Genres: Party, Battle Royale
-- Additional Category: Multiplayer
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (17, 34),
    -- Party
    (25, 34),
    -- Battle Royale
    (50, 34);

-- Multiplayer
-- Game 35: God of War I
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 35),
    -- Action 
    (27, 35),
    -- Action-Adventure
    (28, 35),
    -- Adventure
    (15, 35),
    -- Hack and Slash
    (2, 35),
    -- Fantasy
    (51, 35);

-- Solo
-- Game 36: God of War II
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 36),
    -- Action 
    (27, 36),
    -- Action-Adventure
    (28, 36),
    -- Adventure
    (15, 36),
    -- Hack and Slash
    (2, 36),
    -- Fantasy
    (51, 36);

-- Solo
-- Game 37: God of War: Betrayal
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 37),
    -- Action 
    (27, 37),
    -- Action-Adventure
    (28, 37),
    -- Adventure
    (15, 37),
    -- Hack and Slash
    (2, 37),
    -- Fantasy
    (51, 37);

-- Solo
-- Game 38: God of War: Chains of Olympus
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 38),
    -- Action 
    (27, 38),
    -- Action-Adventure
    (28, 38),
    -- Adventure
    (15, 38),
    -- Hack and Slash
    (2, 38),
    -- Fantasy
    (51, 38);

-- Solo
-- Game 39: God of War: III
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 39),
    -- Action 
    (27, 39),
    -- Action-Adventure
    (28, 39),
    -- Adventure
    (15, 39),
    -- Hack and Slash
    (2, 39),
    -- Fantasy
    (51, 39);

-- Solo
-- Game 40: God of War: Ghost of Sparta
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 40),
    -- Action 
    (27, 40),
    -- Action-Adventure
    (28, 40),
    -- Adventure
    (15, 40),
    -- Hack and Slash
    (2, 40),
    -- Fantasy
    (51, 40);

-- Solo
-- Game 41: God of War: Ascension
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 41),
    -- Action 
    (27, 41),
    -- Action-Adventure
    (28, 41),
    -- Adventure
    (15, 41),
    -- Hack and Slash
    (2, 41),
    -- Fantasy
    (51, 41);

-- Solo
-- Game 42: God of War
-- Genres: Action-Adventure, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 42),
    -- Action 
    (27, 42),
    -- Action-Adventure
    (28, 42),
    -- Adventure
    (2, 42),
    -- Fantasy
    (31, 42),
    -- RPG
    (51, 42);

-- Solo
-- Game 43: God of War: Ragnarok
-- Genres: Action-Adventure, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 43),
    -- Action 
    (27, 43),
    -- Action-Adventure
    (28, 43),
    -- Adventure
    (2, 43),
    -- Fantasy
    (31, 43),
    -- RPG
    (51, 43);

-- Solo
-- Game 44: God of War III Remastered
-- Genres: Action-Adventure, Hack and Slash, Fantasy
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 44),
    -- Action 
    (27, 44),
    -- Action-Adventure
    (28, 44),
    -- Adventure
    (15, 44),
    -- Hack and Slash
    (2, 44),
    -- Fantasy
    (51, 44);

-- Solo
-- Game 45: Stardew Valley
-- Genres: Simulation, RPG, Farming
-- Additional Categories: Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (18, 45),
    -- Simulation
    (31, 45),
    -- RPG
    (19, 45),
    -- Farming
    (50, 45),
    -- Multiplayer
    (9, 45);

-- Co-op
-- Game 46: Hades
-- Genres: Rogue-like
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 46),
    -- Action
    (31, 46),
    -- RPG
    (20, 46),
    -- Rogue-like
    (15, 46),
    -- Hack and Slash
    (51, 46);

-- Solo
-- Game 47: Baldur's Gate 3
-- Genres: RPG, Fantasy
-- Additional Categories: Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (28, 47),
    -- Adventure
    (31, 47),
    -- RPG
    (2, 47),
    -- Fantasy
    (29, 47),
    -- Narrative
    (50, 47),
    -- Multiplayer
    (9, 47);

-- Co-op
-- Game 48: Monster Hunter: World
-- Genres: Fantasy, Hunting
-- Additional Categories: Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 48),
    -- Open-world
    (2, 48),
    -- Fantasy
    (10, 48),
    -- Action
    (21, 48),
    -- Hunting
    (31, 48),
    -- RPG
    (50, 48),
    -- Multiplayer
    (9, 48);

-- Co-op
-- Game 49: Cyber Shadow
-- Genres: Action
-- Additional Category: Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 49),
    -- Action
    (40, 49),
    -- Platform
    (51, 49);

-- Solo
-- Game 50: Animal Crossing: New Horizons
-- Genres: Simulation, Open World
-- Additional Categories: Multiplayer, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (18, 50),
    -- Simulation
    (1, 50),
    -- Open World
    (19, 50),
    -- Farming
    (24, 50),
    -- Sand box
    (50, 50),
    -- Multiplayer
    (9, 50);

-- Co-op
-- Game 51: Tom Clancy's Rainbow Six Siege
-- Genres: FPS, Action, Tactical Shooter
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 51),
    -- FPS
    (50, 51),
    -- Multiplayer
    (10, 51);

-- Action
-- Game 52: Final Fantasy VII Remake
-- Genres: Action RPG, Fantasy
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 52),
    -- Action
    (31, 52),
    -- RPG
    (2, 52),
    -- Fantasy
    (51, 52);

--Solo
-- Game 53: League of Legends
-- Genres: MOBA
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (48, 53),
    -- MOBA
    (50, 53),
    -- Multiplayer
    (34, 53);

-- RTS
-- Game 54: Apex Legends
-- Genres: Battle Royale, FPS
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (25, 54),
    -- Battle Royale
    (11, 54),
    -- FPS
    (50, 54);

-- Multiplayer
-- Game 55: Among Us
-- Genres: Party, Social Deduction
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (17, 55),
    -- Party
    (49, 55),
    -- VR
    (50, 55);

-- Multiplayer
-- Game 56: Call of Duty: Warzone
-- Genres: Battle Royale, FPS
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (25, 56),
    -- Battle Royale
    (11, 56),
    -- FPS
    (32, 56),
    -- War
    (10, 56),
    -- Action
    (50, 56);

-- Multiplayer
-- Game 57: Fortnite
-- Genres: Battle Royale, Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (25, 57),
    -- Battle Royale
    (10, 57),
    -- Action
    (12, 57),
    -- TPS
    (50, 57);

-- Multiplayer
-- Game 58: Overwatch
-- Genres: FPS, Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 58),
    -- FPS
    (10, 58),
    -- Action
    (50, 58);

-- Multiplayer
-- Game 59: Valorant
-- Genres: FPS, Tactical Shooter
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 59),
    -- FPS
    (50, 59);

-- Multiplayer
-- Game 60: Destiny 2
-- Genres: FPS, Action, MMO
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 60),
    -- Open-world
    (10, 60),
    -- Action
    (27, 60),
    -- Action-Adventure
    (28, 60),
    -- Adventure
    (11, 60),
    -- FPS
    (50, 60);

-- Multiplayer
-- Game 61: Counter-Strike: Global Offensive
-- Genres: FPS, Action, Tactical Shooter
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 61),
    -- FPS
    (10, 61),
    -- Action
    (50, 61);

-- Multiplayer
-- Game 62: Rocket League
-- Genres: Sports, Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (37, 62),
    -- Sports
    (10, 62),
    -- Action
    (50, 62);

-- Multiplayer
-- Game 63: Sea of Thieves
-- Genres: Action-Adventure, Open World, Pirate
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (27, 63),
    -- Action-Adventure
    (10, 63),
    -- Action
    (28, 63),
    -- Adventure
    (1, 63),
    -- Open World
    (26, 63),
    -- Pirate
    (50, 63);

-- Multiplayer
-- Game 64: World of Warcraft
-- Genres: MMORPG, Fantasy
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 64),
    -- Open-world
    (10, 64),
    -- Action
    (27, 64),
    -- Action-Adventure
    (28, 64),
    -- Adventure
    (33, 64),
    -- MMORPG
    (2, 64);

-- Fantasy
-- Game 65: Dead by Daylight
-- Genres: Survival Horror, multiplayer
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 65),
    -- Horror
    (14, 65),
    -- Survival
    (46, 65),
    -- Survival Horror
    (50, 65),
    -- Multiplayer
    (9, 65);

-- Co-op
-- Game 66: Phasmophobia
-- Genres: Horror, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 66),
    -- Horror
    (9, 66),
    -- Co-op
    (49, 66),
    -- VR
    (50, 66);

-- Multiplayer
-- Co-op
-- Game 67: The Sims 4
-- Genres: Simulation
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (18, 67),
    -- Simulation
    (23, 67),
    -- Building
    (51, 67);

-- Solo
-- Game 68: Rust
-- Genres: Survival, Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 68),
    -- Open-world
    -- Action
    (27, 68),
    -- Action-Adventure
    (28, 68),
    -- Adventure
    (14, 68),
    -- Survival
    (10, 68),
    -- Action
    (50, 68);

-- Multiplayer
-- Action
-- Game 69: RuneScape
-- Genres: MMORPG, Fantasy
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 69),
    -- Open-world
    (31, 69),
    -- RPG
    (33, 69),
    -- MMORPG
    (2, 69);

-- Fantasy
-- Game 70: Path of Exile
-- Genres: Action RPG, Hack and Slash
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 70),
    -- Action
    (31, 70),
    -- RPG
    (33, 70),
    -- MMORPG
    (2, 70);

-- Fantasy
-- Game 71: World of Tanks
-- Genres: MMO, Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (50, 71),
    -- Multiplayer
    (18, 71),
    -- Simulation
    (10, 71);

-- Action
-- Game 72: Warframe
-- Genres: Action, Co-op, MMO
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (31, 72),
    -- RPG
    (10, 72),
    -- Action
    (9, 72),
    -- Co-op
    (50, 72);

-- Multiplayer
-- Game 73: Team Fortress 2
-- Genres: FPS, Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 73),
    -- FPS
    (10, 73),
    -- Action
    (50, 73);

-- Multiplayer
-- Game 74: Dota 2
-- Genres: MOBA, RTS
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (48, 74),
    -- MOBA
    (34, 74),
    -- RTS
    (50, 74);

-- Multiplayer
-- Game 75: Smite
-- Genres: MOBA
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (48, 75),
    -- MOBA
    (34, 75),
    -- RTS
    (50, 75);

-- Multiplayer
-- Game 76: Guild Wars 2
-- Genres: MMORPG, Fantasy
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (31, 76),
    -- RPG
    (33, 76),
    -- MMORPG
    (10, 76),
    -- Action
    (27, 76),
    -- Action-Adventure
    (28, 76),
    -- Adventure
    (2, 76);

-- Fantasy
-- Game 77: Arma 3
-- Genres: Military Simulation, FPS
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 77),
    -- FPS
    (10, 77),
    -- Action
    (32, 77),
    -- War
    (50, 77);

-- Multiplayer
-- Game 78: Outlast
-- Genres: Horror, Survival
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 78),
    -- Horror
    (10, 78),
    -- Action
    (27, 78),
    -- Action-Adventure
    (28, 78),
    -- Adventure
    (14, 78),
    -- Survival
    (46, 78),
    -- Survival Horror
    (50, 78);

-- Multiplayer
-- Game 79: The Forest
-- Genres: Survival, Horror
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 79),
    -- Horror
    (9, 79),
    -- Co-op
    (14, 79),
    -- Survival
    (46, 79),
    -- Survival Horror
    (10, 79),
    -- Action
    (27, 79),
    -- Action-Adventure
    (28, 79),
    -- Adventure
    (50, 79);

-- Multiplayer
-- Game 80: Left 4 Dead 2
-- Genres: FPS, Action, Co-op
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (11, 80),
    -- FPS
    (10, 80),
    -- Action
    (50, 80),
    -- Multiplayer
    (9, 80);

-- Co-op
-- Game 81: Among the Sleep
-- Genres: Horror, Adventure
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 81),
    -- Horror
    (28, 81),
    -- Adventure
    (27, 81),
    -- Action-Adventure
    (51, 81),
    -- solo
    (10, 81);

-- Action
-- Game 82: Alien: Isolation
-- Genres: Horror, Survival
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 82),
    -- Horror
    (14, 82),
    -- Survival
    (46, 82),
    -- Survival Horror
    (47, 82),
    -- Science fiction
    (51, 82),
    -- Solo
    (10, 82);

-- Game 83: Amnesia: The Dark Descent
-- Genres: Horror, Survival
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 83),
    -- Horror
    (14, 83),
    -- Survival
    (51, 83),
    -- Solo
    (10, 83),
    -- Action
    (27, 83),
    -- Action-Adventure
    (28, 83);

-- Adventure
-- Game 84: The Evil Within
-- Genres: Horror, Survival
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 84),
    -- Horror
    (14, 84),
    -- Survival
    (46, 84),
    -- Survival Horror
    (51, 84),
    -- Solo
    (10, 84);

-- Action
-- Game 85: Dead Space
-- Genres: Horror, Survival
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (8, 85),
    -- Horror
    (12, 85),
    -- TPS
    (14, 85),
    -- Survival
    (47, 85),
    -- Science fiction
    (51, 85),
    -- Solo
    (10, 85),
    -- Action
    (27, 85),
    -- Action-Adventure
    (28, 85);

-- Adventure
-- Game 86: Dark Souls
-- Genres: Action RPG, Fantasy, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 86),
    -- Action
    (31, 86),
    -- RPG
    (2, 86),
    -- Fantasy
    (27, 86),
    -- Action-Adventure
    (28, 86),
    -- Adventure
    (6, 86),
    -- Souls-like
    (51, 86);

-- Solo
-- Game 87: Dark Souls II
-- Genres: Action RPG, Fantasy, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (31, 87),
    -- RPG
    (2, 87),
    -- Fantasy
    (10, 87),
    -- Action
    (27, 87),
    -- Action-Adventure
    (28, 87),
    -- Adventure
    (6, 87),
    -- Souls-like
    (51, 87);

-- Solo
-- Souls-like
-- Game 88: Dark Souls III
-- Genres: Action RPG, Fantasy, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (31, 88),
    -- RPG
    (2, 88),
    -- Fantasy
    (10, 88),
    -- Action
    (27, 88),
    -- Action-Adventure
    (28, 88),
    -- Adventure
    (6, 88),
    -- Souls-like
    (51, 88);

-- Solo
-- Game 89: Bloodborne
-- Genres: Action RPG, Fantasy, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 89),
    -- Open-world
    (31, 89),
    -- RPG
    (2, 89),
    -- Fantasy
    (10, 89),
    -- Action
    (27, 89),
    -- Action-Adventure
    (28, 89),
    -- Adventure
    (6, 89),
    -- Souls-like
    (51, 89);

-- Solo
-- Souls-like
-- Game 90: The Surge
-- Genres: Action RPG, Sci-Fi, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 90),
    -- Action
    (31, 90),
    -- RPG
    (2, 90),
    -- Fantasy
    (27, 90),
    -- Action-Adventure
    (28, 90),
    -- Adventure
    (6, 90),
    -- Souls-like
    (51, 90),
    -- Solo
    (47, 90);

-- Science Fiction
-- Game 91: Lords of the Fallen
-- Genres: Action RPG, Fantasy, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (1, 91),
    -- Open-world
    (8, 91),
    -- Co-op
    (31, 91),
    -- RPG
    (2, 91),
    -- Fantasy
    (10, 91),
    -- Action
    (27, 91),
    -- Action-Adventure
    (28, 91),
    -- Adventure
    (6, 91),
    -- Souls-like
    (51, 91);

-- Solo
-- Game 92: Salt and Sanctuary
-- Genres: Action RPG, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (2, 92),
    -- Fantasy
    (10, 92),
    -- Action
    (31, 92),
    -- RPG
    (6, 92),
    -- Souls-like
    (51, 92),
    -- Solo
    (16, 92);

-- Metroidvania
-- Game 93: Hollow Knight
-- Genres: Action, Adventure
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 93),
    -- Action
    (16, 93),
    -- Metroidvania
    (27, 93),
    -- Action-Adventure
    (28, 93),
    -- Adventure
    (6, 93),
    -- Souls-like
    (51, 93);

-- Solo
-- Game 94: Ashen
-- Genres: Action RPG, Open World
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 94),
    -- Action
    (31, 94),
    -- RPG
    (1, 94),
    -- Open World
    (6, 94),
    -- Souls-like
    (28, 94),
    -- Action-Adventure
    (27, 94),
    -- Adventure
    (51, 94);

-- Solo
-- Game 95: Nioh
-- Genres: Action RPG, Fantasy, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 95),
    -- Action
    (31, 95),
    -- RPG
    (6, 95),
    -- Souls-like
    (28, 95),
    -- Action-Adventure
    (51, 95);

-- Solo
-- Game 96: Remnant: From the Ashes
-- Genres: Action, Co-op, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 96),
    -- Action
    (9, 96),
    -- Co-op
    (31, 96),
    -- RPG
    (27, 96),
    -- Action-Adventure
    (28, 96),
    -- Adventure
    (6, 96),
    -- Souls-like
    (51, 96);

-- Solo
-- Game 97: Blasphemous
-- Genres: Action
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 97),
    -- Action
    (31, 97),
    -- RPG
    (6, 97),
    -- Souls-like
    (28, 97),
    -- Action-Adventure
    (51, 97),
    -- Solo
    (16, 97);

-- Metroidvania
-- Game 98: Code Vein
-- Genres: Action RPG, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 98),
    -- Action
    (31, 98),
    -- RPG
    (6, 98);

-- Game 99: Mortal Shell
-- Genres: Action RPG, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 99),
    -- Action
    (31, 99),
    -- RPG
    (6, 99),
    -- Souls-like
    (28, 99),
    -- Action-Adventure
    (27, 99),
    -- Adventure
    (51, 99);

-- Solo
-- Game 100: Elden Ring
-- Genres: Action RPG, Fantasy, Open World, Souls-like
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (9, 100),
    -- Co-op
    (51, 100),
    -- Solo
    (10, 100),
    -- Action
    (27, 100),
    -- Action-Adventure
    (28, 100),
    -- Adventure
    (31, 100),
    -- RPG
    (2, 100),
    -- Fantasy
    (1, 100),
    -- Open World
    (6, 100);

-- Souls-like
-- Game 101: Bloons TD 6
-- Genres: Strategy, Tower Defense
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (35, 101),
    -- TBS (Turn-Based Strategy)
    (22, 101),
    -- Tower Defense
    (50, 101),
    -- Multiplayer
    (51, 101);

-- Solo
-- Game 102: Squewe Run
-- Genres: Action, Solo
INSERT INTO
    category (genre_id, video_game_id)
VALUES
    (10, 102),
    -- Action
    (51, 102);

-- Solo
INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 1, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 2, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 3, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 4, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 5, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 6, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 7, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 8, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 9, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 10, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 11, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 12, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 13, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 14, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 15, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 16, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 17, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 18, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 19, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 20, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 21, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 22, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 23, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 24, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 25, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 26, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 27, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 28, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 29, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 30, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 31, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 32, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 33, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 34, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 35, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 36, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 37, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 38, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 39, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 40, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 41, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 42, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 43, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 44, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 45, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 46, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 47, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 48, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 49, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 50, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 51, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 52, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 53, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 54, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 55, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 56, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 57, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 58, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 59, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 60, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 61, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 62, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 63, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 64, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 65, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 66, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 67, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 68, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 69, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 70, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 71, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 72, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 73, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 74, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 75, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 76, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 77, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 78, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 79, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 80, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 81, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 82, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 83, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 84, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 85, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 86, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 87, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 88, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 89, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 90, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 91, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 92, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 93, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 94, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 95, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 96, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 97, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 98, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 99, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 100, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 101, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 102, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 103, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 104, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 105, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 106, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 107, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 108, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 109, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 110, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 111, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 112, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 113, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 114, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 115, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 116, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 117, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 118, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 119, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 120, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 121, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 122, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 123, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 124, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 125, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 126, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 127, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 128, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 129, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 130, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 131, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 132, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 133, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 134, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 135, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 136, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 137, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 138, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 139, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 140, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 141, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 142, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 143, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 144, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 145, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 146, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 147, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 148, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 149, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 150, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 151, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 152, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 153, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 154, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 155, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 156, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 157, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 158, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 159, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 160, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 161, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 162, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 163, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 164, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 165, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 166, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 167, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 168, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 169, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 170, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 171, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 172, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 173, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 174, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 175, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 176, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 177, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 178, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 179, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 180, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 181, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 182, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 183, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 184, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 185, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 186, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 187, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 188, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 189, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 190, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 191, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 192, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 193, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 194, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 195, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 196, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 197, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 198, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 199, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 200, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 201, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 202, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 203, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 204, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 205, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 206, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 207, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 208, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 209, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 210, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 211, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 212, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 213, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 214, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 215, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 216, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 217, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 218, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 219, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 220, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 221, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 222, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 223, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 224, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 225, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 226, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 227, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 228, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 229, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 230, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 231, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 232, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 233, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 234, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 235, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 236, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 237, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 238, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 239, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 240, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 241, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 242, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 243, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 244, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 245, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 246, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 247, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 248, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 249, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 250, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 251, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 252, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 253, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 254, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 255, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 256, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 257, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 258, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 259, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 260, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 261, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 262, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 263, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 264, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 265, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 266, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 267, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 268, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 269, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 270, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 271, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 272, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 273, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 274, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 275, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 276, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 277, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 278, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 279, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 280, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 281, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 282, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 283, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 284, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 285, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 286, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 287, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 288, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 289, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 290, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 291, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 292, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 293, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 294, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 295, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 296, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 297, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 298, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 299, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 300, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 301, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 302, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 303, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 304, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 305, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 306, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 307, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 308, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 309, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 310, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 311, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 312, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 313, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 314, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 315, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 316, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 317, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 318, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 319, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 320, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 321, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 322, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 323, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 324, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 325, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 326, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 327, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 328, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 329, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 330, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 331, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 332, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 333, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 334, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 335, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 336, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 337, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 338, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 339, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 340, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 341, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 342, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 343, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 344, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 345, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 346, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 347, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 348, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 349, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 350, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 351, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 352, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 353, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 354, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 355, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 356, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 357, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 358, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 359, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 360, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 361, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 362, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 363, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 364, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 365, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 366, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 367, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 368, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 369, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 370, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 371, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 372, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 373, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 374, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 375, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 376, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 377, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 378, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 379, TRUE, 5, 'Great game!', '2021-01-01');

INSERT INTO
    game (
        user_id,
        publication_id,
        is_owned,
        review_rating,
        review_comment,
        review_date
    )
VALUES
    (3, 380, TRUE, 5, 'Great game!', '2021-01-01');