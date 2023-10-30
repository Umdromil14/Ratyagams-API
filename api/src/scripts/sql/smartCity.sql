DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user"
(
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
    description VARCHAR NOT NULL
);

DROP TABLE IF EXISTS video_game CASCADE;

CREATE TABLE video_game(
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);

DROP TABLE IF EXISTS publication CASCADE;

CREATE TABLE publication (
    ID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    platform_code VARCHAR,
    video_game_id integer,
    release_date DATE NOT NULL,
    release_price DECIMAL(5,2),
    store_page_url VARCHAR,
    FOREIGN KEY (platform_code) REFERENCES platform(code) ON DELETE SET NULL,
    FOREIGN KEY (video_game_id) REFERENCES video_game(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS game CASCADE;

CREATE TABLE game (
    user_id INTEGER NOT NULL,
    publication_id integer NOT NULL,
    is_owned BOOLEAN NOT NULL DEFAULT FALSE,
    review_rating integer check (review_rating >= 0 and review_rating <= 5),
    review_comment VARCHAR,
    review_date DATE,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (publication_id) REFERENCES publication(id)
);

DROP TABLE IF EXISTS type CASCADE;

CREATE TABLE type (
    id INTEGER NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);

DROP TABLE IF EXISTS category CASCADE;

CREATE TABLE category(
    type_id integer NOT NULL,
    video_game_id integer NOT NULL,
    FOREIGN KEY (type_id) REFERENCES type(id),
    FOREIGN KEY (video_game_id) REFERENCES video_game(id)
);

INSERT INTO TYPE (name,description) VALUES ('Open World','Open World games allow players to explore and interact with a large, open area.');
INSERT INTO TYPE (name,description) VALUES ('Fantasy','Fantasy games feature magical and imaginative settings.');
INSERT INTO TYPE (name,description) VALUES ('Cyberpunk','Cyberpunk games are set in futuristic, dystopian worlds.');
INSERT INTO TYPE (name,description) VALUES ('Western','Western games are set in the American Old West.');
INSERT INTO TYPE (name,description) VALUES ('Crime','Crime games involve criminal activities and organizations.');
INSERT INTO TYPE (name,description) VALUES ('Stealth','Stealth games emphasize sneaking and covert missions.');
INSERT INTO TYPE (name,description) VALUES ('Historical','Historical games are set in real-world historical periods.');
INSERT INTO TYPE (name,description) VALUES ('Souls-like','Souls-like games are similar to the Souls series.');
INSERT INTO TYPE (name,description) VALUES ('Feudal Japan','Feudal Japan games are set in the historical period of feudal Japan.');
INSERT INTO TYPE (name,description) VALUES ('Post-Apocalyptic','Post-Apocalyptic games are set in a world after a major disaster.');
INSERT INTO TYPE (name,description) VALUES ('Horror','Horror games focus on creating a terrifying experience for players.');
INSERT INTO TYPE (name,description) VALUES ('Star Wars','Star Wars games are set in the Star Wars universe.');
INSERT INTO TYPE (name,description) VALUES ('Zombies','Zombie games feature undead creatures that attack the player.');
INSERT INTO TYPE (name,description) VALUES ('Co-op','Co-op games allow players to work together to achieve a common goal.');
INSERT INTO TYPE (name,description) VALUES ('Supernatural','Supernatural games involve paranormal or supernatural elements.');


-- Action Games
INSERT INTO TYPE (name, description) VALUES ('Action', 'Action games emphasize physical challenges and combat.');
INSERT INTO TYPE (name, description) VALUES ('First-Person Shooter (FPS)', 'First-Person Shooter games focus on combat from a first-person perspective.');
INSERT INTO TYPE (name, description) VALUES ('Third-Person Shooter (TPS)', 'Third-Person Shooter games involve shooting and combat from a third-person view.');
INSERT INTO TYPE (name, description) VALUES ('Fighting', 'Fighting games feature one-on-one combat between characters.');
INSERT INTO TYPE (name, description) VALUES ('Infiltration', 'Infiltration games involve stealthy, covert missions and sneaking.');
INSERT INTO TYPE (name, description) VALUES ('Survival', 'Survival games challenge players to stay alive in harsh conditions.');
INSERT INTO TYPE (name, description) VALUES ('Beat ''em up', 'Beat ''em up games involve hand-to-hand combat against multiple enemies.');
INSERT INTO TYPE (name, description) VALUES ('Hack and Slash', 'Hack and Slash games involve fast-paced combat against multiple enemies.');
INSERT INTO TYPE (name, description) VALUES ('Hero Shooter', 'Hero Shooter games involve team-based combat with unique characters.');
INSERT INTO TYPE (name, description) VALUES ('Metroidvania', 'Metroidvania games feature a large, interconnected world with areas that can be explored in any order.');
INSERT INTO TYPE (name, description) VALUES ('Platform Fighter', 'Platform Fighter games involve fighting on a platform with the goal of knocking opponents off.');
INSERT INTO TYPE (name, description) VALUES ('Parkour', 'Parkour games involve running and jumping across platforms and obstacles.');
INSERT INTO TYPE (name, description) VALUES ('Party', 'Party games are designed for multiplayer fun with friends and family.');
INSERT INTO TYPE (name, description) VALUES ('Mythology', 'Mythology games are set in a world inspired by mythology.');
INSERT INTO TYPE (name, description) VALUES ('Simulation', 'Simulation games simulate real-world or fictional activities.');
INSERT INTO TYPE (name, description) VALUES ('Farming', 'Farming games involve managing a farm and growing crops.');
INSERT INTO TYPE (name, description) VALUES ('Roguelike', 'Roguelike games feature procedurally-generated levels and permadeath.');
INSERT INTO TYPE (name, description) VALUES ('Dungeon & Dragons', 'D&D games are based on the Dungeons & Dragons tabletop role-playing game.');
INSERT INTO TYPE (name, description) VALUES ('Hunting', 'Hunting games involve tracking and hunting animals.');
INSERT INTO TYPE (name, description) VALUES ('Tactical Shooter', 'Tactical Shooter games emphasize strategy and combat tactics.');
INSERT INTO TYPE (name, description) VALUES ('Tactical', 'Tactical games emphasize strategy and combat tactics.');
INSERT INTO TYPE (name, description) VALUES ('Social Deduction', 'Social Deduction games involve players trying to figure out who is lying.');
INSERT INTO TYPE (name, description) VALUES ('Tower Defense', 'Tower Defense games involve building defenses to stop enemies from reaching a goal.');
INSERT INTO TYPE (name, description) VALUES ('Building', 'Building games involve constructing and managing buildings and cities.');
INSERT INTO TYPE (name, description) VALUES ('Sandbox', 'Sandbox games allow players to explore and interact with a large, open area.');
INSERT INTO TYPE (name, description) VALUES ('Battle Royale', 'Battle Royale games involve a large number of players competing to be the last one standing.');
INSERT INTO TYPE (name, description) VALUES ('Team-Based', 'Team-Based games involve players working together to achieve a common goal.');
INSERT INTO TYPE (name,description) VALUES ('Vehicle-based','Vehicle-based games involve driving or piloting vehicles.');
INSERT INTO TYPE (name, description) VALUES ('Pirates', 'Pirate games are set in a world of pirates and piracy.');
INSERT INTO TYPE (name , description) VALUES ('Asymmetrical Multiplayer', 'Asymmetrical Multiplayer games involve players with different roles and abilities.');
INSERT INTO TYPE (name , description) VALUES ('Paranormal', 'Paranormal games involve paranormal or supernatural elements.');
INSERT INTO TYPE (name , description) VALUES ('vehicle combat', 'vehicle combat games involve combat using vehicles.');
INSERT INTO TYPE (name, description) VALUES ('Military Simulation', 'Military Simulation games simulate military combat and tactics.');
INSERT INTO TYPE (name , description) VALUES ('Gothic Horror', 'Gothic Horror games are set in a dark, gothic world.');
INSERT INTO TYPE (name , description) VALUES ('Vampire', 'Vampire games are set in a world of vampires and vampire hunters.');

-- Adventure Games
INSERT INTO TYPE (name, description) VALUES ('Action-Adventure', 'Action-Adventure games combine elements of action and adventure games.');
INSERT INTO TYPE (name, description) VALUES ('Adventure', 'Adventure games combine elements of action and adventure games.');
INSERT INTO TYPE (name, description) VALUES ('Graphic Adventure', 'Graphic Adventure games emphasize storytelling and puzzles.');
INSERT INTO TYPE (name, description) VALUES ('Exploration', 'Exploration games focus on discovering new places and environments.');
INSERT INTO TYPE (name, description) VALUES ('Narrative', 'Narrative games place a strong emphasis on storytelling and character development.');
INSERT INTO TYPE (name, description) VALUES ('Point-and-Click', 'Point-and-Click games involve interacting with the environment using a cursor.');
INSERT INTO TYPE (name, description) VALUES ('Role-Playing (RPG)', 'Role-Playing games allow players to assume the role of a character and make choices.');
INSERT INTO TYPE (name, description) VALUES ('War', 'War games involve military conflicts and combat.');
INSERT INTO TYPE (name, description) VALUES ('Cold War Era', 'Cold War Era games are set during the Cold War period.');
-- Role-Playing Games (RPG)
INSERT INTO TYPE (name, description) VALUES ('Western Role-Playing (WRPG)', 'Western RPGs typically feature open worlds and player choice.');
INSERT INTO TYPE (name, description) VALUES ('Japanese Role-Playing (JRPG)', 'Japanese RPGs often have a more linear narrative and turn-based combat.');
INSERT INTO TYPE (name, description) VALUES ('Massively Multiplayer Online Role-Playing (MMORPG)', 'MMORPGs are online multiplayer games with deep character progression.');
INSERT INTO TYPE (name, description) VALUES ('Tactical Role-Playing', 'Tactical RPGs emphasize strategy and turn-based combat.');

-- Strategy Games
INSERT INTO TYPE (name, description) VALUES ('Real-Time Strategy (RTS)', 'Real-Time Strategy games involve resource management and combat in real-time.');
INSERT INTO TYPE (name, description) VALUES ('Turn-Based Strategy (TBS)', 'Turn-Based Strategy games allow players to take turns in decision-making.');
INSERT INTO TYPE (name, description) VALUES ('Management', 'Management games focus on overseeing and organizing various aspects.');

-- Sports and Racing Games
INSERT INTO TYPE (name, description) VALUES ('Sports', 'Sports games simulate real-world sports, like soccer or basketball.');
INSERT INTO TYPE (name, description) VALUES ('Racing', 'Racing games involve high-speed competitions with various vehicles.');
INSERT INTO TYPE (name, description) VALUES ('Sports Simulation', 'Sports Simulation games aim to realistically recreate sports experiences.');
INSERT INTO TYPE (name, description) VALUES ('Racing Simulation', 'Racing Simulation games aim to realistically recreate racing experiences.');
INSERT INTO TYPE (name, description) VALUES ('Soccer', 'Soccer games simulate the sport of soccer.');
-- Puzzle and Brain Teaser Games
INSERT INTO TYPE (name, description) VALUES ('Puzzle', 'Puzzle games challenge players with logic, patterns, and problem-solving.');
INSERT INTO TYPE (name, description) VALUES ('Brain Teaser', 'Brain Teaser games provide mind-bending challenges.');
INSERT INTO TYPE (name, description) VALUES ('Platformer', 'Platformer games involve running and jumping across platforms.');

-- Music and Rhythm Games
INSERT INTO TYPE (name, description) VALUES ('Dance', 'Dance games involve rhythm-based dance challenges.');
INSERT INTO TYPE (name, description) VALUES ('Music', 'Music games focus on rhythm and music-related activities.');
INSERT INTO TYPE (name, description) VALUES ('Rhythm', 'Rhythm games require players to time actions with the beat of the music.');

-- Simulation Games
INSERT INTO TYPE (name, description) VALUES ('Life Simulation', 'Life Simulation games simulate daily life activities and choices.');
INSERT INTO TYPE (name, description) VALUES ('Vehicle Simulation', 'Vehicle Simulation games focus on controlling various vehicles.');
INSERT INTO TYPE (name, description) VALUES ('Economic Simulation', 'Economic Simulation games involve managing finances and businesses.');
INSERT INTO TYPE (name, description) VALUES ('Construction and Management Simulation', 'Construction and Management Simulation games involve building and managing cities.');
INSERT INTO TYPE (name, description) VALUES ('Flight Simulation', 'Flight Simulation games simulate the experience of flying aircraft.');
INSERT INTO TYPE (name, description) VALUES ('Space Simulation', 'Space Simulation games simulate the experience of space exploration.');
INSERT INTO TYPE (name, description) VALUES ('Train Simulation', 'Train Simulation games simulate the experience of driving trains.');
INSERT INTO TYPE (name, description) VALUES ('Truck Simulation', 'Truck Simulation games simulate the experience of driving trucks.');
INSERT INTO TYPE (name, description) VALUES ('Social Simulation', 'Social Simulation games simulate social interactions and relationships.');
-- Educational Games
INSERT INTO TYPE (name, description) VALUES ('Educational Games for Children', 'Educational games designed for kids to learn and have fun.');
INSERT INTO TYPE (name, description) VALUES ('Educational Games for Adults', 'Educational games designed for adult learners.');

-- Card and Board Games
INSERT INTO TYPE (name, description) VALUES ('Card', 'Card games are played with a standard deck or specialized cards.');
INSERT INTO TYPE (name, description) VALUES ('Digital Board', 'Digital Board games are video game adaptations of traditional board games.');

-- Horror Games
INSERT INTO TYPE (name, description) VALUES ('Psychological Horror', 'Psychological Horror games focus on the psychological fear of players.');
INSERT INTO TYPE (name, description) VALUES ('Survival Horror', 'Survival Horror games emphasize survival in a terrifying environment.');

-- Science Fiction and Fantasy Games
INSERT INTO TYPE (name, description) VALUES ('Science Fiction', 'Science Fiction games are set in futuristic or space-themed worlds.');
-- Online Multiplayer Games
INSERT INTO TYPE (name, description) VALUES ('Competitive Online (MOBA, Battle Royale)', 'Competitive online games involve player-vs-player competition.');
INSERT INTO TYPE (name, description) VALUES ('Cooperative Online', 'Cooperative online games require teamwork and collaboration.');

-- Platform Games
INSERT INTO TYPE (name, description) VALUES ('2D Platform', '2D Platform games involve running and jumping across two-dimensional levels.');
INSERT INTO TYPE (name, description) VALUES ('3D Platform', '3D Platform games feature three-dimensional worlds and platforming challenges.');

-- Construction and Management Games
INSERT INTO TYPE (name, description) VALUES ('City Building', 'City Building games involve creating and managing cities.');
INSERT INTO TYPE (name, description) VALUES ('Resource Management', 'Resource Management games require efficient allocation of resources.');

-- Virtual Reality (VR) Games
INSERT INTO TYPE (name, description) VALUES ('Games designed for virtual reality', 'VR games are specifically designed for immersive virtual reality experiences.');

INSERT INTO TYPE (name,description) VALUES ('Multiplayer','Multiplayer games allow players to compete or cooperate with each other in various ways.');

INSERT INTO TYPE (name, description) VALUES ('SoloPlayer','games that are played alone');


-- Plateforme 1 : PC
INSERT INTO platform (code, description) VALUES ('PC', 'PC');

-- Plateforme 2 : PlayStation 5
INSERT INTO platform (code, description) VALUES ('PS5', 'PlayStation 5');

-- Plateforme 3 : Xbox Series X
INSERT INTO platform (code, description) VALUES ('XSX', 'Xbox Series X');

-- Plateforme 4 : Nintendo Switch
INSERT INTO platform (code, description) VALUES ('NSW', 'Nintendo Switch');

-- Plateforme 5 : PlayStation 4
INSERT INTO platform (code, description) VALUES ('PS4', 'PlayStation 4');

-- Plateforme 6 : Xbox One
INSERT INTO platform (code, description) VALUES ('XBO', 'Xbox One');

-- Plateforme 7 : Mobile (iOS/Android)
INSERT INTO platform (code, description) VALUES ('MOB', 'Mobile (iOS/Android)');

-- Plateforme 8 : Nintendo 3DS
INSERT INTO platform (code, description) VALUES ('3DS', 'Nintendo 3DS');

-- Plateforme 9 : PlayStation 3
INSERT INTO platform (code, description) VALUES ('PS3', 'PlayStation 3');

-- Plateforme 10 : Xbox 360
INSERT INTO platform (code, description) VALUES ('X360', 'Xbox 360');

-- Plateforme 11 : PlayStation 2
INSERT INTO platform (code, description) VALUES ('PS2', 'PlayStation 2');

-- Plateforme 12 : Xbox
INSERT INTO platform (code, description) VALUES ('XB', 'Xbox');

-- Plateforme 14 : Wii
INSERT INTO platform (code, description) VALUES ('WII', 'Wii');

-- Plateforme 15 : Wii U
INSERT INTO platform (code, description) VALUES ('WIIU', 'Wii U');

-- Plateforme 16 : PlayStation Vita
INSERT INTO platform (code, description) VALUES ('PSV', 'PlayStation Vita');

-- Plateforme 17 : PSP (PlayStation Portable)
INSERT INTO platform (code, description) VALUES ('PSP', 'PSP (PlayStation Portable)');

-- Plateforme 18 : Nintendo DS
INSERT INTO platform (code, description) VALUES ('NDS', 'Nintendo DS');

-- Plateforme 31 : PS1
INSERT INTO platform (code, description) VALUES ('PS1', 'PlayStation 1');


INSERT INTO "user" (username, email, firstname, lastname, hashed_password) VALUES ('BG', 'bg@email.com', 'B', 'G', '1234');
INSERT INTO "user" (username, email, firstname, lastname, hashed_password) VALUES ('umdromil', 'piatman2001@gmail.com', 'Milan', 'Piat', '1234');
INSERT INTO "user" (username, email, hashed_password,is_admin) VALUES ('admin', 'admin@gmail.com','$2a$10$fiKILzSQn2YvA.mbmxhqa.7f8pErrnl4qofZY7nE/a5Vq8KakfPKG', TRUE);
-- Assurez-vous d'avoir déjà créé une table nommée "user" avec les colonnes id, username, email, firstname, lastname, hashed_password et is_admin.

-- Insérer la deuxième ligne (ligne 4 dans vos données) et les suivantes
INSERT INTO "user" (username, email, firstname, lastname, hashed_password, is_admin)
VALUES
('cyril', 'cyril@gmail.be', 'cyril', 'Baras', '$2b$10$R2hFmz2b.d3I84eWHkStXuEB1QrdAvcttmq8ECYNINl6DQR88httC', false), 
('alice_smith', 'alice@example.com', 'Alice', 'Smith', '$2b$10$4fyUwT1RUzg7qOMgNJN6ie4fa3PUkYvOhhNkGnX1HFR6CKoHILheG', false), --password123
('johndoe123', 'john.doe@email.com', 'John', 'Doe', '$2b$10$8o4DPTBRPVT8UKFZhWP5W..WZGEO.wGpeIpFCyNCjixux8N.JPjze', false),--mySecurePassword 
('emily_jones', 'emilyj@email.net', 'Emily', 'Jones', '$2b$10$7yZ1iPSM2tHcgloZ6bE0NOy6XRZfukAp.7C4F0rhgxwCxfMjkzEnS', false),--emilyP@ssword
('michaelbrown', 'mike.brown@example.org', 'Michael', 'Brown', '$2b$10$HQFa64/R2BhATPjv0rxt7Owe8kprBtjTzDgFnlhiOJSzPIWFt.xtK', false),--P@ssw0rd
('sarah_wilson', 'sarah@example.org', 'Sarah', 'Wilson', '$2b$10$UgHLahhJCr9Wp429fEiy5.WnfrtWWdOYG7FEwWGiByhhuq8aiLhhK', false),--SecurePwd2023
('david_jackson', 'davidj@example.com', 'David', 'Jackson', '$2b$10$igZoQoYOmU/RE0x5BQg11OWEuOXk4fRS34hfDYm3uqr/HVXZ.S912', false), --D@v1dPwd
('lisa_anderson', 'lisa@email.net', 'Lisa', 'Anderson', '$2b$10$LltB7Y8QKQIr5GinCWk2fOKamNd8AvzQFvrNeIxzuHWzr9n2mZRce', false),--L1s@Pass
('robert_miller', 'robert.m@example.com', 'Robert', 'Miller', '$2b$10$AHMY/FWUFAGawkeiUaw4/ecAVOnXn7iibqQ66kFhBfdNTeQdu9ez.', false),--R0bertPwd!
('linda_davis', 'linda@example.org', 'Linda', 'Davis', '$2b$10$MPiC4xBEcBagB4oDcwRoduG/QCn/Cb3oCVUjEi1RvWMfNP2.cclCC', false),--L1ndaP@ss
('william_wilkins', 'will@example.net', 'William', 'Wilkins', '$2b$10$fHVkPUxjGIDs2vqIlxPf7OQ.WtSSg5dLCjA9KDhy.moTHixmdXSSC', false);--W1ll1amP@ssw0rd



INSERT INTO video_game ("name", description) VALUES ('Call of Duty: Black Ops Cold War', 'The iconic Black Ops series is back with Call of Duty®: Black Ops Cold War - the direct sequel to the original and fan-favorite Call of Duty®: Black Ops.');
-- Jeu 1
INSERT INTO video_game ("name", description) VALUES ('FIFA 21', 'Win as one in EA SPORTS™ FIFA 21, powered by Frostbite™. Whether it''s on the streets or in the stadium, FIFA 21 has more ways to play than ever before - including the UEFA Champions League and CONMEBOL Libertadores.');

-- Jeu 2
INSERT INTO video_game ("name", description) VALUES ('The Legend of Zelda: Breath of the Wild', 'Explore the vast world of Hyrule and embark on an epic adventure in this critically acclaimed action-adventure game.');

-- Jeu 3
INSERT INTO video_game ("name", description) VALUES ('Cyberpunk 2077', 'Step into the dystopian future of Night City in Cyberpunk 2077, an open-world RPG with a branching narrative and intense combat.');

-- Jeu 4
INSERT INTO video_game ("name", description) VALUES ('Red Dead Redemption 2', 'Immerse yourself in the Wild West as Arthur Morgan in this epic tale of outlaws, loyalty, and survival.');

-- Jeu 5
INSERT INTO video_game ("name", description) VALUES ('The Witcher 3: Wild Hunt', 'Embark on a quest as Geralt of Rivia in this open-world RPG, filled with monsters, magic, and unforgettable characters.');

-- Jeu 6
INSERT INTO video_game ("name", description) VALUES ('Grand Theft Auto V', 'Experience the criminal underworld of Los Santos in this action-packed open-world game from Rockstar.');

-- Jeu 7
INSERT INTO video_game ("name", description) VALUES ('Call of Duty: Modern Warfare', 'Engage in intense warfare and tactical combat in this reboot of the Modern Warfare series.');

-- Jeu 8
INSERT INTO video_game ("name", description) VALUES ('Minecraft', 'Build and explore your own blocky world in the immensely popular sandbox game.');

-- Jeu 9
INSERT INTO video_game ("name", description) VALUES ('Assassin''s Creed Valhalla', 'Embark on a Viking adventure in this Assassin''s Creed title set in the Viking Age.');

-- Jeu 10
INSERT INTO video_game ("name", description) VALUES ('Super Mario Odyssey', 'Join Mario on a globe-trotting adventure to rescue Princess Peach in this Nintendo classic.');

-- Jeu 11
INSERT INTO video_game ("name", description) VALUES ('The Elder Scrolls V: Skyrim', 'Enter the world of Tamriel and explore the frozen land of Skyrim in this epic RPG.');

-- Jeu 12
INSERT INTO video_game ("name", description) VALUES ('Sekiro: Shadows Die Twice', 'Master the way of the shinobi and face challenging foes in this action-adventure game.');

-- Jeu 13
INSERT INTO video_game ("name", description) VALUES ('Horizon Zero Dawn', 'Venture into a post-apocalyptic world as Aloy in this action RPG filled with robotic creatures.');

-- Jeu 14
INSERT INTO video_game ("name", description) VALUES ('Doom Eternal', 'Rip and tear through the forces of Hell in this high-octane first-person shooter.');

-- Jeu 15
INSERT INTO video_game ("name", description) VALUES ('The Last of Us Part II', 'Experience a gripping post-apocalyptic story in this emotionally charged action-adventure game.');

-- Jeu 16
INSERT INTO video_game ("name", description) VALUES ('Star Wars Jedi: Fallen Order', 'Become a Jedi and uncover the mysteries of the Force in this Star Wars action-adventure.');

-- Jeu 17
INSERT INTO video_game ("name", description) VALUES ('Halo: Infinite', 'Master Chief returns in this epic sci-fi first-person shooter, continuing the Halo saga.');

-- Jeu 18
INSERT INTO video_game ("name", description) VALUES ('Resident Evil Village', 'Enter a mysterious village and face grotesque horrors in this survival horror game.');

-- Jeu 19
INSERT INTO video_game ("name", description) VALUES ('Ghost of Tsushima', 'Become a samurai in feudal Japan and defend your homeland in this open-world action game.');

-- Jeu 20
INSERT INTO video_game ("name", description) VALUES ('Final Fantasy VII', 'Relive the classic RPG with updated graphics and an expanded story.');

-- Jeu 21
INSERT INTO video_game ("name", description) VALUES ('Death Stranding', 'Navigate a post-apocalyptic world as Sam Porter Bridges in this unique open-world game.');

-- Jeu 22
INSERT INTO video_game ("name", description) VALUES ('Demon''s Souls', 'Challenge your skills and courage in the remake of this iconic action RPG.');

-- Jeu 23
INSERT INTO video_game ("name", description) VALUES ('Fallout 4', 'Survive the wasteland and shape your destiny in this open-world RPG from Bethesda.');

-- Jeu 24
INSERT INTO video_game ("name", description) VALUES ('Genshin Impact', 'Embark on an adventure in the fantasy world of Teyvat in this action RPG.');

-- Jeu 25
INSERT INTO video_game ("name", description) VALUES ('Borderlands 3', 'Team up with friends in this cooperative shooter and explore the chaotic world of Pandora.');

-- Jeu 26
INSERT INTO video_game ("name", description) VALUES ('The Outer Worlds', 'Uncover corporate conspiracies and make choices in this sci-fi RPG.');

-- Jeu 27
INSERT INTO video_game ("name", description) VALUES ('Control', 'Assume the role of Jesse Faden and investigate supernatural mysteries in this action-adventure game.');

-- Jeu 28
INSERT INTO video_game ("name", description) VALUES ('The Medium', 'Delve into a dark and mysterious dual-reality world in this psychological horror game.');

-- Jeu 29
INSERT INTO video_game ("name", description) VALUES ('Nioh 2', 'Face challenging yokai and samurai in this action RPG set in feudal Japan.');

-- Jeu 30
INSERT INTO video_game ("name", description) VALUES ('Watch Dogs: Legion', 'Recruit and play as anyone in a dystopian London in this open-world game.');

-- Jeu 31
INSERT INTO video_game ("name", description) VALUES ('Bioshock Infinite', 'Explore the floating city of Columbia and uncover its secrets in this first-person shooter.');

-- Jeu 32
INSERT INTO video_game ("name", description) VALUES ('Dying Light 2 stay human', 'Survive a zombie-infested city and use parkour skills to navigate in this survival horror game.');

-- Jeu 33
INSERT INTO video_game ("name", description) VALUES ('Fall Guys: Ultimate Knockout', 'Compete in a whimsical battle royale with other players in this fun and colorful game.');

-- Jeu GOW 34,35,36,37,38,39,40,41,42,43
INSERT INTO video_game ("name", description)
VALUES
('God of War I','The protagonist of the game is Kratos, a Spartan warrior who serves the gods of Olympus. Other characters include many Greek gods, including Athena, the goddess of wisdom and the ally and mentor of Kratos; Ares, the god of war and main antagonist; Poseidon, the god of the sea and the oceans; Aphrodite, the goddess of love and sensuality; Zeus, the king of the gods; Artemis, the goddess of hunting; and Hades, the god of the underworld.'),
('God of War II','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'),
('God of War: Betrayal','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'),
('God of War: Chains of Olympus','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'),
('God of War III','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'),
('God of War: Ghost of Sparta','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'),
('God of War: Ascension','Discover the origins of Kratos as he takes his first steps on a now legendary quest for freedom and vengeance.'),
('God of War','Join Kratos and his son Atreus as they embark on a journey to fulfill a deeply personal quest in this critically acclaimed action game.'),
('God of War: Ragnarok','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.'),
('God of War III Remastered','Join Kratos as he seeks freedom, redemption, and the clarity to avenge his family in the most ambitious God of War adventure in the series so far.');


--need to do the publication
INSERT INTO video_game ("name", description) VALUES ('Stardew Valley', 'Escape to the countryside and build the farm of your dreams in this charming life simulation game.');
INSERT INTO video_game ("name", description) VALUES ('Hades', 'Descend into the underworld and battle your way out in this roguelike action game with a rich narrative.');
INSERT INTO video_game ("name", description) VALUES ('Baldur''s Gate 3', 'Dive into an epic, Dungeons & Dragons-inspired RPG with rich storytelling and tactical battles.');
INSERT INTO video_game ("name", description) VALUES ('Monster Hunter: World', 'Hunt massive creatures in a lush, living ecosystem in this action-packed adventure.');
INSERT INTO video_game ("name", description) VALUES ('Cyber Shadow', 'Experience a retro-inspired action platformer with ninja combat and challenging levels.');
INSERT INTO video_game ("name", description) VALUES ('Animal Crossing: New Horizons', 'Create your island paradise and enjoy a relaxing life simulation game with adorable animal villagers.');
INSERT INTO video_game ("name", description) VALUES ('Tom Clancy''s Rainbow Six Siege', 'Engage in tactical, team-based battles as an operator in this popular first-person shooter.');
INSERT INTO video_game ("name", description) VALUES ('Final Fantasy VII Remake', 'Relive the classic RPG with stunning visuals and reimagined gameplay in this epic remake.');
INSERT INTO video_game ("name", description) VALUES ('League of Legends', 'Join a team of champions and battle in strategic, fast-paced matches in the world''s most popular MOBA.');
INSERT INTO video_game ("name", description) VALUES ('Apex Legends', 'Form a squad of unique characters with special abilities and compete in a fast-paced battle royale.');
INSERT INTO video_game ("name", description) VALUES ('Among Us', 'Work together with friends on a spaceship, but beware of impostors trying to sabotage your missions.');
INSERT INTO video_game ("name", description) VALUES ('Call of Duty: Warzone', 'Drop into a massive battle royale map and engage in intense warfare with realistic weapons and tactics.');
INSERT INTO video_game ("name", description) VALUES ('Fortnite', 'Join the battle royale phenomenon and build, fight, and survive with friends in this high-energy game.');
INSERT INTO video_game ("name", description) VALUES ('Overwatch', 'Choose from a diverse cast of heroes and engage in team-based combat in this popular first-person shooter.');
INSERT INTO video_game ("name", description) VALUES ('Valorant', 'Join a team of agents with special abilities and engage in tactical, team-based combat in this FPS.');
INSERT INTO video_game ("name", description) VALUES ('Destiny 2', 'Explore the solar system and experience epic battles in this sci-fi MMO with FPS elements.');
INSERT INTO video_game ("name", description) VALUES ('Counter-Strike: Global Offensive', 'Engage in tactical, team-based combat in this classic first-person shooter.');
INSERT INTO video_game ("name", description) VALUES ('Rocket League', 'Play soccer with rocket-powered cars in this unique sports game.');
INSERT INTO video_game ("name", description) VALUES ('Sea of Thieves', 'Sail the seas and embark on a pirate adventure with friends in this open-world MMO.');
INSERT INTO video_game ("name", description) VALUES ('World of Warcraft', 'Explore the world of Azeroth and join thousands of players in this massively multiplayer online game.');
INSERT INTO video_game ("name", description) VALUES ('Dead by Daylight', 'Play as either a survivor or a killer in a multiplayer horror game filled with suspense and strategy as you try to escape or hunt.');
INSERT INTO video_game ("name", description) VALUES ('Phasmophobia', 'Work with friends to investigate paranormal activity in this cooperative horror game.');
INSERT INTO video_game ("name", description) VALUES ('The Sims 4', 'Create unique Sims and build the perfect home in this popular life simulation game.');
INSERT INTO video_game ("name", description) VALUES ('Rust', 'Survive the wilderness and build a home in this multiplayer survival game.');
INSERT INTO video_game ("name", description) VALUES ('RuneScape', 'Explore the world of Gielinor and embark on an epic adventure in this classic MMO.');
INSERT INTO video_game ("name", description) VALUES ('Path of Exile', 'Explore a dark fantasy world and customize your character in this free-to-play action RPG.');
INSERT INTO video_game ("name", description) VALUES ('World of Tanks', 'Engage in massive tank battles in this popular free-to-play MMO.');
INSERT INTO video_game ("name", description) VALUES ('Warframe', 'Choose from a variety of powerful Warframes and engage in third-person combat in this free-to-play action game.');
INSERT INTO video_game ("name", description) VALUES ('Team Fortress 2', 'Join a team of mercenaries and engage in team-based combat in this popular free-to-play first-person shooter.');
INSERT INTO video_game ("name", description) VALUES ('Dota 2', 'Join a team of heroes and battle in a strategic, team-based MOBA in this popular free-to-play game.');
INSERT INTO video_game ("name", description) VALUES ('Smite', 'Choose from a diverse cast of gods and engage in strategic, team-based combat in this popular MOBA.');
INSERT INTO video_game ("name", description) VALUES ('Guild Wars 2', 'Explore the world of Tyria and engage in epic battles in this popular MMO.');
INSERT INTO video_game ("name", description) VALUES ('Arma 3', 'Engage in tactical combat in this military simulator with realistic weapons and vehicles.');
INSERT INTO video_game ("name", description) VALUES ('Outlast', 'Enter the Mount Massive Asylum and survive the horrors within in this first-person psychological horror game.');
INSERT INTO video_game ("name", description) VALUES ('The Forest', 'Survive the wilderness and build a shelter in this open-world survival game.');
INSERT INTO video_game ("name", description) VALUES ('Left 4 Dead 2', 'Survive the zombie apocalypse with friends in this cooperative first-person shooter.');
INSERT INTO video_game ("name", description) VALUES ('Among the Sleep', 'Experience a unique horror adventure as a toddler navigating a spooky world filled with surreal terrors.');
INSERT INTO video_game ("name", description) VALUES ('Alien: Isolation', 'Survive a deadly alien threat in this first-person survival horror game.');
INSERT INTO video_game ("name", description) VALUES ('Amnesia: The Dark Descent', 'Explore a dark castle and uncover its secrets in this first-person survival horror game.');
INSERT INTO video_game ("name", description) VALUES ('The Evil Within', 'Survive a nightmarish world filled with horrifying creatures in this third-person survival horror game.');
INSERT INTO video_game ("name", description) VALUES ('Dead Space', 'Fight for survival in a sci-fi horror adventure in this third-person shooter.');
INSERT INTO video_game ("name", description) VALUES ('Dark Souls', 'Dive into the unforgiving and interconnected world of Lordran, where methodical and demanding combat blends with cryptic and profound storytelling.');
INSERT INTO video_game ("name", description) VALUES ('Dark Souls II', 'Explore the kingdom of Drangleic and face equally formidable challenges in this sequel to the Souls series, offering new gameplay mechanics and diverse environments.');
INSERT INTO video_game ("name", description) VALUES ('Dark Souls III', 'Return to a world in decline as an Ashen One and confront terrifying enemies and titanic bosses in this final installment of the Souls series.');
INSERT INTO video_game ("name", description) VALUES ('Bloodborne', 'Explore the eldritch nightmare of Yharnam, filled with grotesque creatures and fast-paced combat in this action RPG by FromSoftware.');
INSERT INTO video_game ("name", description) VALUES ('The Surge', 'Uncover a dystopian future filled with rogue AI and combat-enhanced exosuits in this sci-fi Souls-like action RPG.');
INSERT INTO video_game ("name", description) VALUES ('Lords of the Fallen', 'Embark on a quest to defeat powerful lords in a dark and challenging fantasy world reminiscent of the Souls series.');
INSERT INTO video_game ("name", description) VALUES ('Salt and Sanctuary', 'Experience a 2D side-scrolling Souls-like game with intricate level design and a grim, atmospheric world.');
INSERT INTO video_game ("name", description) VALUES ('Hollow Knight', 'Explore the mysterious, underground world of Hallownest and battle challenging foes in this beautifully hand-drawn 2D metroidvania.');
INSERT INTO video_game ("name", description) VALUES ('Ashen', 'Journey through a world without light and forge alliances in this cooperative Souls-like action RPG with a unique art style.');
INSERT INTO video_game ("name", description) VALUES ('Nioh', 'Face challenging yokai and samurai in this action RPG set in feudal Japan.');
INSERT INTO video_game ("name", description) VALUES ('Remnant: From the Ashes', 'Fight for survival in a post-apocalyptic world filled with monstrous creatures in this cooperative Souls-like shooter.');
INSERT INTO video_game ("name", description) VALUES ('Blasphemous', 'Embark on a dark and punishing pilgrimage through a nightmarish world filled with grotesque enemies and religious themes in this 2D action platformer.');
INSERT INTO video_game ("name", description) VALUES ('Code Vein', 'Explore a post-apocalyptic world as a vampire-like Revenant, battling hordes of enemies and uncovering the mysteries of your existence in this anime-inspired Souls-like game.');
INSERT INTO video_game ("name", description) VALUES ('Mortal Shell', 'Take on the role of a "foundling" who possesses the ability to inhabit the bodies of fallen warriors in this dark and atmospheric action RPG.');
INSERT INTO video_game ("name", description) VALUES ('Elden Ring', 'Delve into a new dark fantasy world created by Hidetaka Miyazaki and George R. R. Martin, featuring an expansive open world and intense Souls-like combat.');

-- 1.Call of Duty: Black Ops Cold War | wikipedia: https://en.wikipedia.org/wiki/Call_of_Duty:_Black_Ops_Cold_War
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url) 
VALUES 
('PC',1,'2020-11-13',69.99,'https://www.activision.com/games/call-of-duty/call-of-duty-black-ops-cold-war'),
('PS5',1,'2020-11-13',79.99,'https://www.playstation.com/en-us/games/call-of-duty-black-ops-cold-war/'),
('XSX',1,'2020-11-13',79.99,'https://www.xbox.com/en-us/games/store/call-of-duty-black-ops-cold-war/9N2DMQBN9RC4/0010/9TJ9G6F6DMK1'),
('PS4',1,'2020-11-13',69.99,'https://www.playstation.com/en-us/games/call-of-duty-black-ops-cold-war/'),
('XBO',1,'2020-11-13',69.99,'https://www.xbox.com/en-us/games/store/call-of-duty-black-ops-cold-war/9N2DMQBN9RC4/0010/9TJ9G6F6DMK1');

-- 2.FIFA 21 | wikipedia: https://en.wikipedia.org/wiki/FIFA_21
INSERT INTO publication (platform_code, video_game_id, release_date, release_price)
VALUES
('PC',2,'2020-10-09',59.99),
('PS5',2,'2020-12-03',69.99),
('XSX',2,'2020-12-03',69.99),
('PS4',2,'2020-10-09',59.99),
('XBO',2,'2020-10-09',59.99),
('NSW',2,'2020-10-09',59.99);

-- 3.The Legend of Zelda: Breath of the Wild | wikipedia: https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild 
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('NSW',3,'2017-03-03',59.99,'https://www.nintendo.com/games/detail/the-legend-of-zelda-breath-of-the-wild-switch/'),
('WIIU',3,'2017-03-03',59.99,null);

-- 4.Cyberpunk 2077 | wikipedia: https://en.wikipedia.org/wiki/Cyberpunk_2077
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url) 
VALUES
('PC',4,'2020-12-10',59.99,'https://store.steampowered.com/app/1091500/Cyberpunk_2077/'),
('PS5',4,'2022-02-15',59.99,'https://www.playstation.com/en-us/games/cyberpunk-2077/'),
('XSX',4,'2022-02-15',59.99,'https://www.xbox.com/en-us/games/store/cyberpunk-2077/bx3m8l83bbrw'),
('PS4',4,'2020-12-10',59.99,'https://www.playstation.com/en-us/games/cyberpunk-2077/'),
('XBO',4,'2020-12-10',59.99,'https://www.xbox.com/en-us/games/store/cyberpunk-2077/bx3m8l83bbrw');

-- 5.Red Dead Redemption 2 | wikipedia: https://en.wikipedia.org/wiki/Red_Dead_Redemption_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',5,'2019-11-05',59.99,'https://www.rockstargames.com/reddeadredemption2/'),
('PS4',5,'2018-10-26',59.99,'https://www.rockstargames.com/reddeadredemption2/'),
('XBO',5,'2018-10-26',59.99,'https://www.rockstargames.com/reddeadredemption2/');

-- 6.The Witcher 3: Wild Hunt | wikipedia: https://en.wikipedia.org/wiki/The_Witcher_3:_Wild_Hunt
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',6,'2015-05-19',39.99,'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/'),
('PS5',6,'2022-12-14',59.99,'https://www.playstation.com/en-us/games/the-witcher-3-wild-hunt-ps4/'),
('XSX',6,'2022-12-14',59.99,'https://www.xbox.com/en-us/games/store/the-witcher-3-wild-hunt/br765873cqjd'),
('PS4',6,'2015-05-19',39.99,'https://www.playstation.com/en-us/games/the-witcher-3-wild-hunt-ps4/'),
('XBO',6,'2015-05-19',39.99,'https://www.xbox.com/en-us/games/store/the-witcher-3-wild-hunt/br765873cqjd'),
('NSW',6,'2019-10-15',59.99,'https://www.nintendo.com/games/detail/the-witcher-3-wild-hunt-complete-edition-switch/');

-- 7.Grand Theft Auto V | wikipedia: https://en.wikipedia.org/wiki/Grand_Theft_Auto_V
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',7,'2015-04-14',29.99,'https://www.rockstargames.com/V/'),
('PS5',7,'2022-03-15',59.99,'https://www.rockstargames.com/V/'),
('XSX',7,'2022-03-15',59.99,'https://www.rockstargames.com/V/'),
('PS4',7,'2014-11-18',29.99,'https://www.rockstargames.com/V/'),
('XBO',7,'2014-11-18',29.99,'https://www.rockstargames.com/V/'),
('PS3',7,'2013-09-17',29.99,null),
('X360',7,'2013-09-17',29.99,null);

-- 8.Call of Duty: Modern Warfare | wikipedia: https://en.wikipedia.org/wiki/Call_of_Duty:_Modern_Warfare_(2019_video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',8,'2019-10-25',59.99,'https://store.steampowered.com/app/2000950/Call_of_Duty_Modern_Warfare/'),
('PS4',8,'2019-10-25',59.99,'https://www.playstation.com/en-us/games/call-of-duty-modern-warfare/'),
('XBO',8,'2019-10-25',59.99,'https://www.xbox.com/en-us/games/store/call-of-duty-modern-warfare/c5dtj99626k3');

-- 9.Minecraft | wikipedia: https://en.wikipedia.org/wiki/Minecraft
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',9,'2011-11-18',19.99,'https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc'),
('PS4',9,'2014-09-04',19.99,'https://www.playstation.com/en-us/games/minecraft/'),
('XBO',9,'2014-09-05',19.99,'https://www.xbox.com/en-us/games/store/minecraft/9mvxmvt8zkwc'),
('NSW',9,'2017-05-17',29.99,'https://www.nintendo.com/us/store/products/minecraft-deluxe-collection-switch/'),
('MOB',9,'2011-10-07',6.99,'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe&hl=en&gl=US'),
('PS3',9,'2013-12-18',19.99,null),
('X360',9,'2012-05-09',19.99,null),
('PSV',9,'2014-10-15',19.99,null),
('WIIU',9,'2015-12-17',29.99,null),
('3DS',9,'2017-09-13',29.99,null);

-- 10. Assassin's Creed Valhalla | wikipedia: https://en.wikipedia.org/wiki/Assassin%27s_Creed_Valhalla
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',10,'2020-11-10',59.99,'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'),
('PS5',10,'2020-11-19',59.99,'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'),
('XSX',10,'2020-11-10',59.99,'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'),
('PS4',10,'2020-11-10',59.99,'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla'),
('XBO',10,'2020-11-10',59.99,'https://www.ubisoft.com/en-us/game/assassins-creed/valhalla');

-- 11.Super Mario Odyssey | wikipedia: https://en.wikipedia.org/wiki/Super_Mario_Odyssey
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('NSW',11,'2017-10-27',59.99,'https://www.nintendo.com/games/detail/super-mario-odyssey-switch/');

-- 12.The Elder Scrolls V: Skyrim | wikipedia: https://en.wikipedia.org/wiki/The_Elder_Scrolls_V:_Skyrim
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',12,'2011-11-11',19.99,'https://store.steampowered.com/app/72850/The_Elder_Scrolls_V_Skyrim/'),
('PS5',12,'2021-11-11',59.99,'https://www.playstation.com/en-us/games/the-elder-scrolls-v-skyrim/'),
('XSX',12,'2021-11-11',59.99,'https://www.xbox.com/en-us/games/store/the-elder-scrolls-v-skyrim-special-edition/bq1w1t1fc14w'),
('PS4',12,'2016-10-28',19.99,'https://www.playstation.com/en-us/games/the-elder-scrolls-v-skyrim/'),
('XBO',12,'2016-10-28',19.99,'https://www.xbox.com/en-us/games/store/the-elder-scrolls-v-skyrim-special-edition/bq1w1t1fc14w'),
('NSW',12,'2017-11-17',59.99,'https://www.nintendo.com/games/detail/the-elder-scrolls-v-skyrim-switch/'),
('PS3',12,'2011-11-11',19.99,null),
('X360',12,'2011-11-11',19.99,null);

-- 13.Sekiro: Shadows Die Twice | wikipedia: https://en.wikipedia.org/wiki/Sekiro:_Shadows_Die_Twice
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',13,'2019-03-22',59.99,'https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/'),
('PS4',13,'2019-03-22',59.99,'https://www.playstation.com/en-us/games/sekiro-shadows-die-twice/'),
('XBO',13,'2019-03-22',59.99,'https://www.xbox.com/en-us/games/store/sekiro-shadows-die-twice-goty-edition/bqd5wrrp2d6q');

-- 14.Horizon Zero Dawn | wikipedia: https://en.wikipedia.org/wiki/Horizon_Zero_Dawn
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',14,'2020-08-07',49.99,'https://store.steampowered.com/app/1151640/Horizon_Zero_Dawn_Complete_Edition/'),
('PS4',14,'2017-03-01',19.99,'https://www.playstation.com/en-us/games/horizon-zero-dawn/');

-- 15.Doom Eternal | wikipedia: https://en.wikipedia.org/wiki/Doom_Eternal
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',15,'2020-03-20',59.99,'https://store.steampowered.com/app/782330/DOOM_Eternal/'),
('PS5',15,'2021-06-29',59.99,'https://www.playstation.com/e1212n-us/games/doom-eternal/'),
('XSX',15,'2021-06-29',59.99,'https://www.xbox.com/en-us/games/store/doom-eternal-standard-edition/9p5s26314hwq'),
('PS4',15,'2020-03-20',59.99,'https://www.playstation.com/en-us/ga12mes/doom-eternal/'),
('XBO',15,'2020-03-20',59.99,'https://www.xbox.com/en-us/games/store/doom-eternal-standard-edition/9p5s26314hwq'),
('NSW',15,'2020-12-08',59.99,'https://www.nintendo.com/games/detail/doom-eternal-switch/');

-- 16.The Last of Us Part II | wikipedia: https://en.wikipedia.org/wiki/The_Last_of_Us_Part_II
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PS4',16,'2020-06-19',59.99,'https://www.playstation.com/en-us/games/the-last-of-us-part-ii/');

-- 17.Star Wars Jedi: Fallen Order | wikipedia: https://en.wikipedia.org/wiki/Star_Wars_Jedi:_Fallen_Order
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',17,'2019-11-15',59.99,'https://store.steampowered.com/app/1172380/STAR_WARS_Jedi_Fallen_Order/'),
('PS5',17,'2021-06-11',59.99,'https://www.playstation.com/en-us/games/star-wars-jedi-fallen-order/'),
('XSX',17,'2021-06-11',59.99,'https://www.xbox.com/en-us/games/store/star-wars-jedi-fallen-order/c2csdtscbz0c'),
('PS4',17,'2019-11-15',59.99,'https://www.playstation.com/en-us/games/star-wars-jedi-fallen-order/'),
('XBO',17,'2019-11-15',59.99,'https://www.xbox.com/en-us/games/store/star-wars-jedi-fallen-order/c2csdtscbz0c');

-- 18.Halo: Infinite | wikipedia: https://en.wikipedia.org/wiki/Halo_Infinite
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',18,'2021-12-08',59.99,'https://www.xbox.com/en-us/games/halo-infinite'),
('XSX',18,'2021-12-08',59.99,'https://www.xbox.com/en-us/games/halo-infinite'),
('XBO',18,'2021-12-08',59.99,'https://www.xbox.com/en-us/games/halo-infinite');

-- 19.Resident Evil Village | wikipedia: https://en.wikipedia.org/wiki/Resident_Evil_Village
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',19,'2021-05-07',59.99,'https://store.steampowered.com/app/1196590/Resident_Evil_Village/'),
('PS5',19,'2021-05-07',59.99,'https://www.playstation.com/en-us/games/resident-evil-village/'),
('XSX',19,'2021-05-07',59.99,'https://www.xbox.com/en-us/games/store/resident-evil-village/9n2s04lgxxh4'),
('PS4',19,'2021-05-07',59.99,'https://www.playstation.com/en-us/games/resident-evil-village/'),
('XBO',19,'2021-05-07',59.99,'https://www.xbox.com/en-us/games/store/resident-evil-village/9n2s04lgxxh4'),
('NSW',19,'2022-10-28',59.99,'https://www.nintendo.com/us/store/products/resident-evil-village-cloud-switch/');

-- 20.Ghost of Tsushima | wikipedia: https://en.wikipedia.org/wiki/Ghost_of_Tsushima
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PS5',20,'2021-08-20',59.99,'https://www.playstation.com/en-us/games/ghost-of-tsushima/'),
('PS4',20,'2020-06-17',59.99,'https://www.playstation.com/en-us/games/ghost-of-tsushima/');

-- 21.Final Fantasy VII | wikipedia: https://en.wikipedia.org/wiki/Final_Fantasy_VII
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',21,'2013-07-13',12.99,'https://store.steampowered.com/app/39140/FINAL_FANTASY_VII/'),
('PS4',21,'2015-12-05',29.99,'https://www.playstation.com/en-us/games/final-fantasy-vii/'),
('XBO',21,'2019-03-26',15.99,'https://www.xbox.com/en-us/games/store/final-fantasy-vii/bwkxqc5bl5r1'),
('NSW',21,'2019-03-26',15.99,'https://www.nintendo.com/games/detail/final-fantasy-vii-switch/'),
('PS1',21,'1997-11-17',null,null),
('MOB',21,'2016-07-07',15.99,'https://play.google.com/store/apps/details?id=com.square_enix.android_googleplay.FFVII&hl=en&gl=US');

-- 22.Death Stranding | wikipedia: https://en.wikipedia.org/wiki/Death_Stranding
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',22,'2020-07-14',59.99,'https://store.epicgames.com/en-US/p/death-stranding-directors-cut'),
('PS5',22,'2021-09-24',59.99,'https://www.playstation.com/en-us/games/death-stranding/'),
('PS4',22,'2019-11-08',59.99,'https://www.playstation.com/en-us/games/death-stranding/');

-- 23.Demon's Souls | wikipedia: https://en.wikipedia.org/wiki/Demon%27s_Souls
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PS3',23,'2009-10-06',19.99,null);

-- 24.Fallout 4 | wikipedia: https://en.wikipedia.org/wiki/Fallout_4
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',24,'2015-11-10',29.99,'https://store.steampowered.com/app/377160/Fallout_4/'),
('PS4',24,'2015-11-10',29.99,'https://www.playstation.com/en-us/games/fallout-4/'),
('XBO',24,'2015-11-10',29.99,'https://www.xbox.com/en-us/games/store/fallout-4/c3kldkzbhncz');

-- 25.Genshin Impact | wikipedia: https://en.wikipedia.org/wiki/Genshin_Impact
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PS4',25,'2020-09-28',0,'https://genshin.mihoyo.com/en'),
('MOB',25,'2020-09-28',0,'https://genshin.mihoyo.com/en'),
('PC',25,'2020-09-28',0,'https://genshin.mihoyo.com/en'),
('PS5',25,'2021-04-28',0,'https://genshin.mihoyo.com/en');

-- 26.Borderlands 3 | wikipedia: https://en.wikipedia.org/wiki/Borderlands_3
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',26,'2019-09-13',59.99,'https://store.steampowered.com/app/397540/Borderlands_3/'),
('PS4',26,'2019-09-13',59.99,'https://www.playstation.com/en-us/games/borderlands-3/'),
('XBO',26,'2019-09-13',59.99,'https://www.xbox.com/en-us/games/store/borderlands-3/c34nb0f1b5wq'),
('NSW',26,'2023-10-06',59.99,'https://www.nintendo.com/us/store/products/borderlands-3-ultimate-edition-switch/'),
('PS5',26,'2021-11-12',59.99,'https://www.playstation.com/en-us/games/borderlands-3/'),
('XSX',26,'2021-11-10',59.99,'https://www.xbox.com/en-us/games/store/borderlands-3/c34nb0f1b5wq');

-- 27.The Outer Worlds | wikipedia: https://en.wikipedia.org/wiki/The_Outer_Worlds
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',27,'2019-10-25',59.99,'https://store.steampowered.com/app/578650/The_Outer_Worlds/'),
('PS5',27,'2023-03-07',59.99,'https://www.playstation.com/en-us/games/the-outer-worlds/'),
('XSX',27,'2023-03-07',59.99,'https://www.xbox.com/en-us/games/store/the-outer-worlds/bvtkn6cq8w5f'),
('PS4',27,'2019-10-25',59.99,'https://www.playstation.com/en-us/games/the-outer-worlds/'),
('XBO',27,'2019-10-25',59.99,'https://www.xbox.com/en-us/games/store/the-outer-worlds/bvtkn6cq8w5f'),
('NSW',27,'2020-06-05',59.99,'https://www.nintendo.com/games/detail/the-outer-worlds-switch/');

-- 28.Control | wikipedia: https://en.wikipedia.org/wiki/Control_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',28,'2019-08-27',29.99,'https://store.steampowered.com/app/870780/Control_Ultimate_Edition/'),
('PS5',28,'2021-02-02',39.99,'https://www.playstation.com/en-us/games/control/'),
('XSX',28,'2021-02-02',39.99,'https://www.xbox.com/en-US/games/store/control/BZ6W9LRPC26W'),
('PS4',28,'2019-08-27',29.99,'https://www.playstation.com/en-us/games/control/'),
('XBO',28,'2019-08-27',29.99,'https://www.xbox.com/en-US/games/store/control/BZ6W9LRPC26W'),
('NSW',28,'2020-10-30',39.99,'https://www.nintendo.com/games/detail/control-ultimate-edition-cloud-version-switch/');

-- 29.The Medium | wikipedia: https://en.wikipedia.org/wiki/The_Medium_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',28,'2021-01-28',49.99,'https://store.steampowered.com/app/1293160/The_Medium/'),
('PS5',28,'2021-09-03',49.99,null),
('XSX',28,'2021-01-28',49.99,'https://www.xbox.com/en-us/games/store/the-medium/9nfsr96g6k4n'),
('XBO',28,'2021-01-28',49.99,'https://www.xbox.com/en-us/games/store/the-medium/9nfsr96g6k4n'),
('NSW',28,'2023-06-29',49.99,'https://www.nintendo.com/us/store/products/the-medium-cloud-version-switch/');

-- 30.Nioh 2 | wikipedia: https://en.wikipedia.org/wiki/Nioh_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',30,'2021-02-05',49.99,'https://store.steampowered.com/app/1325200/Nioh_2__The_Complete_Edition/'),
('PS5',30,'2021-02-05',49.99,'https://www.playstation.com/en-us/games/nioh-2/'),
('PS4',30,'2020-03-13',49.99,'https://www.playstation.com/en-us/games/nioh-2/');

-- 31.Watch Dogs: Legion | wikipedia: https://en.wikipedia.org/wiki/Watch_Dogs:_Legion
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',30,'2020-10-29',59.99,'https://store.steampowered.com/app/1289310/Watch_Dogs_Legion/'),
('PS5',30,'2020-11-12',59.99,'https://www.playstation.com/en-us/games/watch-dogs-legion/'),
('XSX',30,'2020-11-10',59.99,'https://www.xbox.com/en-us/games/store/watch-dogs-legion/c1wrx8zd77m9'),
('PS4',30,'2020-10-29',59.99,'https://www.playstation.com/en-us/games/watch-dogs-legion/'),
('XBO',30,'2020-10-29',59.99,'https://www.xbox.com/en-us/games/store/watch-dogs-legion/c1wrx8zd77m9');

-- 32.Bioshock Infinite | wikipedia: https://en.wikipedia.org/wiki/BioShock_Infinite
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',32,'2013-03-26',29.99,'https://store.steampowered.com/app/8870/BioShock_Infinite/'),
('PS3',32,'2013-03-26',29.99,null),
('X360',32,'2013-03-26',29.99,null);

-- 33.Dying Light 2 stay human | wikipedia: https://en.wikipedia.org/wiki/Dying_Light_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PC',33,'2022-02-04',59.99,'https://store.steampowered.com/app/534380/Dying_Light_2_Stay_Human/'),
('PS5',33,'2022-02-04',59.99,'https://www.playstation.com/en-us/games/dying-light-2-stay-human/'),
('XSX',33,'2022-02-04',59.99,'https://www.xbox.com/en-us/games/store/dying-light-2-stay-human/bpcl0txcgj1w'),
('PS4',33,'2022-02-04',59.99,'https://www.playstation.com/en-us/games/dying-light-2-stay-human/'),
('XBO',33,'2022-02-04',59.99,'https://www.xbox.com/en-us/games/store/dying-light-2-stay-human/bpcl0txcgj1w');

-- 34.Fall Guys: Ultimate Knockout | wikipedia: https://en.wikipedia.org/wiki/Fall_Guys
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PC',34,'2020-08-04',0,'https://store.epicgames.com/en-US/p/fall-guys'),
('PS5',34,'2022-06-21',0,'https://www.playstation.com/en-us/games/fall-guys-ultimate-knockout/'),
('XSX',34,'2022-06-21',0,'https://www.xbox.com/en-us/games/store/fall-guys/9pmxh5249dg5'),
('PS4',34,'2020-08-04',0,'https://www.playstation.com/en-us/games/fall-guys-ultimate-knockout/'),
('XBO',34,'2022-06-21',0,'https://www.xbox.com/en-us/games/store/fall-guys/9pmxh5249dg5'),
('NSW',34,'2022-06-21',0,'https://www.nintendo.com/us/store/products/fall-guys-switch/');

-- 35.God of War I | wikipedia: https://en.wikipedia.org/wiki/God_of_War_(2005_video_game)
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES 
('PS2',35,'2005-03-22'),
('PS3',35,'2005-03-22'),
('PSV',35,'2007-03-13');

-- 36.God of War II | wikipedia: https://en.wikipedia.org/wiki/God_of_War_II
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES 
('PS2',36,'2007-03-13'),
('PS3',36,'2007-03-13'),
('PSV',36,'2007-03-13');

-- 37.God of War: Betrayal | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Betrayal
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES
('MOB',37,'2007-06-20');

-- 38.God of War: Chains of Olympus | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Chains_of_Olympus
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES 
('PSP',38,'2008-03-04'),
('PS3',38,'2008-03-04'),
('PSV',38,'2008-03-04');

-- 39.God of War III | wikipedia: https://en.wikipedia.org/wiki/God_of_War_III
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES 
('PS3',39,'2010-03-16');

-- 40.God of War: Ghost of Sparta | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Ghost_of_Sparta
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES 
('PSP',40,'2010-11-02'),
('PS3',40,'2010-11-02'),
('PSV',40,'2010-11-02');

-- 41.God of War: Ascension | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Ascension
INSERT INTO publication (platform_code, video_game_id, release_date)
VALUES 
('PS3',41,'2013-03-12');

-- 42.God of War | wikipedia: https://en.wikipedia.org/wiki/God_of_War_(2018_video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PS4',42,'2018-04-20',19.99,'https://www.playstation.com/en-us/games/god-of-war/'),
('PC',42,'2022-01-14',49.99,'https://store.steampowered.com/app/1593500/God_of_War/');

-- 43.God of War: Ragnarok | wikipedia: https://en.wikipedia.org/wiki/God_of_War:_Ragnar%C3%B6k
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PS5',43,'2022-11-09',69.99,'https://www.playstation.com/en-us/games/god-of-war-ragnarok/'),
('PS4',43,'2022-11-09',69.99,'https://www.playstation.com/en-us/games/god-of-war-ragnarok/');

-- 44 God of war III Remastered | wikipedia: https://en.wikipedia.org/wiki/God_of_War_III_Remastered
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PS4',44,'2015-07-15',19.99,'https://www.playstation.com/en-us/games/god-of-war-iii-remastered/');

-- 45. Stardew Valley | wikipedia: https://en.wikipedia.org/wiki/Stardew_Valley
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',45,'2016-02-26',14.99,'https://store.steampowered.com/app/413150/Stardew_Valley/'),
('PS4',45,'2016-12-13',14.99,'https://www.playstation.com/en-us/games/stardew-valley/'),
('XBO',45,'2016-12-14',14.99,'https://www.xbox.com/en-us/games/store/stardew-valley/c3d891z6tnqm'),
('NSW',45,'2017-10-05',14.99,'https://www.nintendo.com/games/detail/stardew-valley-switch/'),
('MOB',45,'2019-03-14',4.99,'https://play.google.com/store/apps/details?id=com.chucklefish.stardewvalley&hl=en&gl=US'),
('PSV',45,'2016-12-13',14.99,null);

-- 46. Hades | wikipedia: https://en.wikipedia.org/wiki/Hades_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',46,'2020-09-17',24.99,'https://store.steampowered.com/app/1145360/Hades/'),
('PS5',46,'2021-08-13',24.99,'https://www.playstation.com/en-us/games/hades/'),
('XSX',46,'2021-08-13',24.99,'https://www.xbox.com/en-us/games/store/hades/9p8dl6w0jbb8'),
('PS4',46,'2021-08-13',24.99,'https://www.playstation.com/en-us/games/hades/'),
('XBO',46,'2021-08-13',24.99,'https://www.xbox.com/en-us/games/store/hades/9p8dl6w0jbb8'),
('NSW',46,'2020-09-17',24.99,'https://www.nintendo.com/games/detail/hades-switch/');

-- 47. Baldur's Gate 3 | wikipedia: https://en.wikipedia.org/wiki/Baldur%27s_Gate_III
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',47,'2023-08-03',59.99,'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/'),
('PS5',47,'2023-09-06',69.99,'https://www.playstation.com/en-us/games/baldurs-gate-3/');

-- 48. Monster Hunter: World | wikipedia: https://en.wikipedia.org/wiki/Monster_Hunter:_World
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',48,'2018-08-09',29.99,'https://store.steampowered.com/app/582010/Monster_Hunter_World/'),
('PS4',48,'2018-01-26',29.99,'https://www.playstation.com/en-us/games/monster-hunter-world/'),
('XBO',48,'2018-01-26',29.99,'https://www.xbox.com/en-us/games/store/monster-hunter-world/bng91pt95lqn');

-- 49. Cyber Shadow | wikipedia: https://en.wikipedia.org/wiki/Cyber_Shadow
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',49,'2021-01-26',19.99,'https://store.steampowered.com/app/861250/Cyber_Shadow/'),
('PS5',49,'2021-01-26',19.99,'https://store.playstation.com/en-us/product/UP2200-PPSA01882_00-CYBERSHADOW00001'),
('XSX',49,'2021-01-26',19.99,'https://www.xbox.com/en-us/games/store/cyber-shadow/9nx9lj5jswh8'),
('PS4',49,'2021-01-26',19.99,'https://store.playstation.com/en-us/product/UP2200-PPSA01882_00-CYBERSHADOW00001'),
('XBO',49,'2021-01-26',19.99,'https://www.xbox.com/en-us/games/store/cyber-shadow/9nx9lj5jswh8'),
('NSW',49,'2021-01-26',19.99,'https://www.nintendo.com/games/detail/cyber-shadow-switch/');

-- 50. Animal Crossing: New Horizons | wikipedia: https://en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('NSW',50,'2020-03-20',59.99,'https://www.nintendo.com/games/detail/animal-crossing-new-horizons-switch/');

-- 51. Tom Clancy's Rainbow Six Siege | wikipedia: https://en.wikipedia.org/wiki/Tom_Clancy%27s_Rainbow_Six_Siege
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PC',51,'2015-12-01',19.99,'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/'),
('PS5',51,'2020-12-01',19.99,'https://www.playstation.com/en-us/games/tom-clancys-rainbow-six-siege/'),
('XSX',51,'2020-12-01',19.99,'https://www.xbox.com/en-us/games/store/tom-clancys-rainbow-six-siege/c12t09dsvp8j'),
('PS4',51,'2015-12-01',19.99,'https://www.playstation.com/en-us/games/tom-clancys-rainbow-six-siege/'),
('XBO',51,'2015-12-01',19.99,'https://www.xbox.com/en-us/games/store/tom-clancys-rainbow-six-siege/c12t09dsvp8j');

-- 52. Final Fantasy VII Remake | wikipedia: https://en.wikipedia.org/wiki/Final_Fantasy_VII_Remake
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PS4',52,'2020-04-10',59.99,'https://www.playstation.com/en-us/games/final-fantasy-vii-remake/'),
('PS5',52,'2021-06-10',69.99,'https://www.playstation.com/en-us/games/final-fantasy-vii-remake-intergrade/'),
('PC',52,'2021-12-06',59.99,'https://store.steampowered.com/app/1516570/FINAL_FANTASY_VII_REMAKE/');

-- 53. League of Legends | wikipedia: https://en.wikipedia.org/wiki/League_of_Legends
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',53,'2009-10-27',0,'https://play.na.leagueoflegends.com/en_US');

-- 54. Apex Legends | wikipedia: https://en.wikipedia.org/wiki/Apex_Legends
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PC',54,'2019-02-04',0,'https://www.ea.com/games/apex-legends'),
('PS5',54,'2022-03-29',0,'https://www.playstation.com/en-us/games/apex-legends/'),
('XSX',54,'2022-03-29',0,'https://www.xbox.com/en-us/games/store/apex-legends/bv9ml45j2q5v'),
('PS4',54,'2019-02-04',0,'https://www.playstation.com/en-us/games/apex-legends/'),
('XBO',54,'2019-02-04',0,'https://www.xbox.com/en-us/games/store/apex-legends/bv9ml45j2q5v'),
('NSW',54,'2021-03-09',0,'https://www.nintendo.com/games/detail/apex-legends-switch/');

-- 55. Among Us | wikipedia: https://en.wikipedia.org/wiki/Among_Us
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',55,'2019-02-04',4.49,'https://store.steampowered.com/app/945360/Among_Us/'),
('PS5',55,'2022-03-29',4.49,'https://www.playstation.com/en-us/games/among-us/'),
('XSX',55,'2022-03-29',4.49,'https://www.xbox.com/en-us/games/store/among-us/9NG07QJNK38J'),
('PS4',55,'2019-02-04',4.49,'https://www.playstation.com/en-us/games/among-us/'),
('XBO',55,'2019-02-04',4.49,'https://www.xbox.com/en-us/games/store/among-us/9NG07QJNK38J'),
('NSW',55,'2021-03-09',5.00,'https://www.nintendo.com/games/detail/among-us-switch/'),
('MOB',55,'2022-03-17',0,'https://play.google.com/store/apps/details?id=com.innersloth.spacemafia&hl=en&gl=US');

-- 56. Call of Duty: Warzone | wikipedia: https://en.wikipedia.org/wiki/Call_of_Duty:_Warzone
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',56,'2020-03-10',0,'https://www.callofduty.com/warzone'),
('PS4',56,'2020-03-10',0,'https://www.playstation.com/en-us/games/call-of-duty-warzone/'),
('XBO',56,'2020-03-10',0,'https://www.xbox.com/en-us/games/store/call-of-duty-warzone/9nnfg8bqrcxl');

-- 57. Fortnite | wikipedia: https://en.wikipedia.org/wiki/Fortnite
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',57,'2017-07-25',0,'https://www.epicgames.com/fortnite/en-US/home'),
('PS5',57,'2017-07-25',0,'https://www.playstation.com/en-us/games/fortnite/'),
('XSX',57,'2017-07-25',0,'https://www.xbox.com/en-us/games/store/fortnite/bt5p2x999vh2'),
('PS4',57,'2017-07-25',0,'https://www.playstation.com/en-us/games/fortnite/'),
('XBO',57,'2017-07-25',0,'https://www.xbox.com/en-us/games/store/fortnite/bt5p2x999vh2'),
('NSW',57,'2018-06-12',0,'https://www.nintendo.com/us/store/products/fortnite-switch/'),
('MOB',57,'2018-06-12',0,null);

-- 58. Overwatch | wikipedia: https://en.wikipedia.org/wiki/Overwatch_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price)
VALUES
('PC',58,'2016-05-24',19.99),
('PS4',58,'2016-05-24',19.99),
('XBO',58,'2016-05-24',19.99),
('NSW',58,'2019-10-15',39.99);

-- 59. Valorant | wikipedia: https://en.wikipedia.org/wiki/Valorant
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES 
('PC',59,'2020-06-02',0,'https://playvalorant.com/en-us/');

-- 60. Destiny 2 | wikipedia: https://en.wikipedia.org/wiki/Destiny_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',60,'2017-10-24',0,'https://www.bungie.net/7/en/Destiny/NewLight'),
('PS5',60,'2020-12-08',0,'https://www.playstation.com/en-us/games/destiny-2/'),
('XSX',60,'2020-12-08',0,'https://www.xbox.com/en-us/games/store/destiny-2/bpq955fqfph6'),
('PS4',60,'2017-09-06',0,'https://www.playstation.com/en-us/games/destiny-2/'),
('XBO',60,'2017-09-06',0,'https://www.xbox.com/en-us/games/store/destiny-2/bpq955fqfph6');

-- 61. Counter-Strike: Global Offensive | wikipedia: https://en.wikipedia.org/wiki/Counter-Strike:_Global_Offensive
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',61,'2012-08-21',0,'https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/');

-- 62. Rocket League | wikipedia: https://en.wikipedia.org/wiki/Rocket_League
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',62,'2015-07-07',0,'https://store.epicgames.com/en-US/p/rocket-league'),
('PS5',62,'2015-07-07',0,'https://www.playstation.com/en-us/games/rocket-league/'),
('XSX',62,'2015-07-07',0,'https://www.xbox.com/en-us/games/store/rocket-league/c125w9bg2k0v'),
('PS4',62,'2015-07-07',0,'https://www.playstation.com/en-us/games/rocket-league/'),
('XBO',62,'2015-07-07',0,'https://www.xbox.com/en-us/games/store/rocket-league/c125w9bg2k0v'),
('NSW',62,'2015-07-07',0,'https://www.nintendo.com/games/detail/rocket-league-switch/');

-- 63. Sea of Thieves | wikipedia: https://en.wikipedia.org/wiki/Sea_of_Thieves
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',63,'2018-03-20',0,'https://www.seaofthieves.com/en'),
('XSX',63,'2020-11-10',0,'https://www.xbox.com/en-us/games/store/sea-of-thieves/9p2n57mc619k'),
('XBO',63,'2018-03-20',0,'https://www.xbox.com/en-us/games/store/sea-of-thieves/9p2n57mc619k');

-- 64. World of Warcraft | wikipedia: https://en.wikipedia.org/wiki/World_of_Warcraft
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',64,'2004-11-23',0,'https://worldofwarcraft.com/en-us/');

-- 65. Dead by Daylight | wikipedia: https://en.wikipedia.org/wiki/Dead_by_Daylight
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',65,'2016-06-14',19.99,'https://store.steampowered.com/app/381210/Dead_by_Daylight/'),
('PS5',65,'2020-11-19',29.99,'https://www.playstation.com/en-us/games/dead-by-daylight/'),
('XSX',65,'2020-11-10',29.99,'https://www.xbox.com/en-us/games/store/dead-by-daylight/c0n22p73qz60'),
('PS4',65,'2017-06-23',29.99,'https://www.playstation.com/en-us/games/dead-by-daylight/'),
('XBO',65,'2017-06-23',29.99,'https://www.xbox.com/en-us/games/store/dead-by-daylight/c0n22p73qz60'),
('NSW',65,'2019-09-24',29.99,'https://www.nintendo.com/games/detail/dead-by-daylight-switch/'),
('MOB',65,'2020-04-16',0,'https://play.google.com/store/apps/details?id=com.netease.dbdena&hl=en&gl=US');

-- 66. Phasmophobia | wikipedia: https://en.wikipedia.org/wiki/Phasmophobia_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',66,'2020-09-18',13.99,'https://store.steampowered.com/app/739630/Phasmophobia/');

-- 67. The Sims 4 | wikipedia: https://en.wikipedia.org/wiki/The_Sims_4
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',67,'2014-09-04',39.99,'https://store.steampowered.com/app/1222670/The_Sims_4_Snowy_Escape/'),
('PS4',67,'2017-11-17',39.99,'https://www.playstation.com/en-us/games/the-sims-4/'),
('XBO',67,'2017-11-17',39.99,'https://www.xbox.com/en-us/games/store/the-sims-4/c08jxnk0vg5l');

-- 68. Rust | wikipedia: https://en.wikipedia.org/wiki/Rust_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',68,'2018-02-08',39.99,'https://store.steampowered.com/app/252490/Rust/'),
('PS4',68,'2021-05-21',39.99,'https://www.playstation.com/en-us/games/rust/'),
('XBO',68,'2021-05-21',0,'https://www.xbox.com/en-us/games/store/rust/9nphhzbv60b4');

-- 69. RuneScape | wikipedia: https://en.wikipedia.org/wiki/RuneScape
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',69,'2001-01-04',0,'https://www.runescape.com/'),
('MOB',69,'2001-01-04',0,'https://play.google.com/store/apps/details?id=com.jagex.runescape.android&hl=en&gl=US');

-- 70. Path of Exile | wikipedia: https://en.wikipedia.org/wiki/Path_of_Exile
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',70,'2013-10-23',0,'https://store.steampowered.com/app/238960/Path_of_Exile/'),
('PS4',70,'2019-03-26',0,'https://www.playstation.com/en-us/games/path-of-exile/'),
('XBO',70,'2017-08-24',0,'https://www.xbox.com/en-us/games/store/path-of-exile/BWC95BZPFBS7');

-- 71. World of Tanks | wikipedia: https://en.wikipedia.org/wiki/World_of_Tanks
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',71,'2011-04-12',0,'https://worldoftanks.com/en/'),
('PS5',71,'2021-10-26',0,'https://www.playstation.com/en-us/games/world-of-tanks/'),
('PS4',71,'2016-01-19',0,'https://www.playstation.com/en-us/games/world-of-tanks/'),
('XBO',71,'2015-07-28',0,'https://www.xbox.com/en-us/games/store/world-of-tanks/c57l9gr0hhb7'),
('X360',71,'2014-02-12',0,null),
('NSW',71,'2019-09-25',0,'https://www.nintendo.com/games/detail/world-of-tanks-blitz-switch/');

-- 72. Warframe | wikipedia: https://en.wikipedia.org/wiki/Warframe
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',72,'2013-03-25',0,'https://store.steampowered.com/app/230410/Warframe/'),
('PS5',72,'2020-11-26',0,'https://www.playstation.com/en-us/games/warframe/'),
('XSX',72,'2021-04-14',0,'https://www.xbox.com/en-us/games/store/warframe/BPS3XF74B9V1'),
('PS4',72,'2013-11-29',0,'https://www.playstation.com/en-us/games/warframe/'),
('XBO',72,'2014-09-02',0,'https://www.xbox.com/en-us/games/store/warframe/BPS3XF74B9V1'),
('NSW',72,'2018-11-20',0,'https://www.nintendo.com/games/detail/warframe-switch/');

-- 73. Team Fortress 2 | wikipedia: https://en.wikipedia.org/wiki/Team_Fortress_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',73,'2007-10-18',0,'https://store.steampowered.com/app/440/Team_Fortress_2/'),
('PS3',73,'2007-11-23',0,null),
('XBO',73,'2007-10-18',0,null);

-- 74. Dota 2 | wikipedia: https://en.wikipedia.org/wiki/Dota_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',74,'2013-07-09',0,'https://store.steampowered.com/app/570/Dota_2/');

-- 75. SMITE | wikipedia: https://en.wikipedia.org/wiki/Smite_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',75,'2014-03-25',0,'https://store.steampowered.com/app/386360/SMITE/'),
('PS4',75,'2016-05-31',0,'https://www.playstation.com/en-us/games/smite/'),
('XBO',75,'2015-08-19',0,'https://www.xbox.com/en-us/games/store/smite/c2mhs238pdns'),
('NSW',75,'2019-02-18',0,'https://www.nintendo.com/games/detail/smite-switch/');

-- 76. Guild Wars 2 | wikipedia: https://en.wikipedia.org/wiki/Guild_Wars_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',76,'2012-08-28',0,'https://www.guildwars2.com/en/');

-- 77. Arma 3 | wikipedia: https://en.wikipedia.org/wiki/Arma_3
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',77,'2013-09-12',29.99,'https://store.steampowered.com/app/107410/Arma_3/');

-- 78. Outlast | wikipedia: https://en.wikipedia.org/wiki/Outlast_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',78,'2013-09-04',19.99,'https://store.steampowered.com/app/238320/Outlast/'),
('PS4',78,'2014-02-05',19.99,'https://www.playstation.com/en-us/games/outlast/'),
('XBO',78,'2014-06-19',19.99,'https://www.xbox.com/en-us/games/store/outlast/bp3gh4d3hp2h'),
('NSW',78,'2018-02-27',24.99,'https://www.nintendo.com/games/detail/outlast-switch/');

-- 79. The Forest | wikipedia: https://en.wikipedia.org/wiki/The_Forest_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',79,'2018-04-30',19.99,'https://store.steampowered.com/app/242760/The_Forest/'),
('PS4',79,'2018-11-06',19.99,'https://www.playstation.com/en-us/games/the-forest/');

-- 80. Left 4 Dead 2 | wikipedia: https://en.wikipedia.org/wiki/Left_4_Dead_2
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',80,'2009-11-17',9.99,'https://store.steampowered.com/app/550/Left_4_Dead_2/'),
('X360',80,'2009-11-17',9.99,null);

-- 81. Among the Sleep | wikipedia: https://en.wikipedia.org/wiki/Among_the_Sleep
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',81,'2014-05-29',16.99,'https://store.steampowered.com/app/250620/Among_the_Sleep__Enhanced_Edition/'),
('XBO',81,'2016-06-03',16.99,'https://www.xbox.com/en-us/games/store/among-the-sleep-enhanced-edition/c3k10n1vqtnb'),
('PS4',81,'2015-12-10',16.99,'https://www.playstation.com/en-us/games/among-the-sleep-enhanced-edition/'),
('NSW',81,'2019-05-29',19.99,'https://www.nintendo.com/games/detail/among-the-sleep-enhanced-edition-switch/');

-- 82. Alien: Isolation | wikipedia: https://en.wikipedia.org/wiki/Alien:_Isolation
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',82,'2014-10-06',39.99,'https://store.steampowered.com/app/214490/Alien_Isolation/'),
('PS4',82,'2014-10-06',39.99,'https://www.playstation.com/en-us/games/alien-isolation/'),
('XBO',82,'2014-10-06',39.99,'https://www.xbox.com/en-us/games/store/alien-isolation/c1h9v6slk2k5'),
('PS3',82,'2014-10-06',39.99,null),
('X360',82,'2014-10-06',39.99,null),
('NSW',82,'2019-12-05',34.99,'https://www.nintendo.com/games/detail/alien-isolation-switch/'),
('MOB',82,'2021-04-13',0,'https://play.google.com/store/apps/details?id=com.feralinteractive.alienisolation_android&hl=en&gl=US');

-- 83. Amnesia: The Dark Descent | wikipedia: https://en.wikipedia.org/wiki/Amnesia:_The_Dark_Descent
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',83,'2010-09-08',19.99,'https://store.steampowered.com/app/57300/Amnesia_The_Dark_Descent/'),
('PS4',83,'2016-11-22',19.99,null),
('XBO',83,'2018-11-28',19.99,null),
('NSW',83,'2021-09-28',29.99,null),
('MOB',83,'2020-09-15',0,null);

-- 84. The Evil Within | wikipedia: https://en.wikipedia.org/wiki/The_Evil_Within
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',84,'2014-10-14',19.99,'https://store.steampowered.com/app/268050/The_Evil_Within/'),
('PS4',84,'2014-10-14',19.99,'https://www.playstation.com/en-us/games/the-evil-within/'),
('XBO',84,'2014-10-14',19.99,'https://www.xbox.com/en-us/games/store/the-evil-within/c2m8hbnvpt1t'),
('PS3',84,'2014-10-14',19.99,null),
('X360',84,'2014-10-14',19.99,null);

-- 85. Dead Space | wikipedia: https://en.wikipedia.org/wiki/Dead_Space_(2008_video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',85,'2008-10-24',19.99,'https://store.steampowered.com/app/17470/Dead_Space/'),
('PS3',85,'2008-10-24',19.99,null),
('X360',85,'2008-10-24',19.99,null);

-- 86. Dark Souls | wikipedia: https://en.wikipedia.org/wiki/Dark_Souls_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',86,'2011-10-07',19.99,null),
('PS3',86,'2012-09-22',19.99,null),
('X360',86,'2012-09-22',19.99,null);

-- 87. Dark Souls II | wikipedia: https://en.wikipedia.org/wiki/Dark_Souls_II
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',87,'2014-04-24',39.99,'https://store.steampowered.com/app/236430/DARK_SOULS_II/'),
('PS3',87,'2014-03-11',39.99,null),
('X360',87,'2014-03-11',39.99,null);

-- 88. Dark Souls III | wikipedia: https://en.wikipedia.org/wiki/Dark_Souls_III
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',88,'2016-04-12',59.99,'https://store.steampowered.com/app/374320/DARK_SOULS_III/'),
('PS4',88,'2016-04-12',59.99,'https://www.playstation.com/en-us/games/dark-souls-iii-ps4/'),
('XBO',88,'2016-04-12',59.99,'https://www.xbox.com/en-US/games/store/dark-souls-iii/BW2XDRNSCCPZ');

-- 89. Bloodborne | wikipedia: https://en.wikipedia.org/wiki/Bloodborne
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PS4',89,'2015-03-25',19.99,'https://www.playstation.com/en-us/games/bloodborne-ps4/');

-- 90. The Surge | wikipedia: https://en.wikipedia.org/wiki/The_Surge_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',90,'2017-05-16',14.99,'https://store.steampowered.com/app/378540/The_Surge/'),
('PS4',90,'2017-05-16',19.99,null),
('XBO',90,'2017-05-16',19.99,'https://www.xbox.com/en-us/games/store/the-surge/brkvpthjw525');

-- 91. Lords of the Fallen | wikipedia: https://en.wikipedia.org/wiki/Lords_of_the_Fallen_(2023_video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',91,'2014-10-13',59.99,'https://store.steampowered.com/app/1501750/Lords_of_the_Fallen/'),
('PS5',91,'2014-10-13',79.99,'https://www.playstation.com/en-us/games/lords-of-the-fallen/'),
('XSX',91,'2014-10-13',79.99,'https://www.xbox.com/en-us/games/store/lords-of-the-fallen/9n3cjz3hfhtf');

-- 92. Salt and Sanctuary | wikipedia: https://en.wikipedia.org/wiki/Salt_and_Sanctuary
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',92,'2016-05-17',17.99,'https://store.steampowered.com/app/283640/Salt_and_Sanctuary/'),
('PS4',92,'2016-03-15',17.99,'https://www.playstation.com/en-us/games/salt-and-sanctuary-ps4/'),
('XBO',92,'2019-02-09',17.99,'https://www.xbox.com/en-us/games/store/salt-and-sanctuary/c4v7cd6w5tsk'),
('PSV',92,'2017-03-28',17.99,null),
('NSW',92,'2018-08-02',17.99,'https://www.nintendo.com/games/detail/salt-and-sanctuary-switch/');

-- 93. Hollow Knight | wikipedia: https://en.wikipedia.org/wiki/Hollow_Knight
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',93,'2017-02-24',14.99,'https://store.steampowered.com/app/367520/Hollow_Knight/'),
('PS4',93,'2018-09-25',14.99,'https://www.playstation.com/en-us/games/hollow-knight-voidheart-edition/'),
('XBO',93,'2018-09-25',14.99,'https://www.xbox.com/en-us/games/store/hollow-knight-voidheart-edition/9mw9469v91lm'),
('NSW',93,'2018-06-12',14.99,'https://www.nintendo.com/games/detail/hollow-knight-switch/');

-- 94. Ashen | wikipedia: https://en.wikipedia.org/wiki/Ashen_(2018_video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',94,'2018-12-07',39.99,'https://store.steampowered.com/app/649950/Ashen/'),
('PS4',94,'2019-12-09',39.99,'https://www.playstation.com/en-us/games/ashen-ps4/'),
('XBO',94,'2018-12-07',39.99,'https://www.xbox.com/en-us/games/store/ashen/bnxlppcvs0hn'),
('NSW',94,'2019-12-09',39.99,'https://www.nintendo.com/games/detail/ashen-switch/');

-- 95. Nioh | wikipedia: https://en.wikipedia.org/wiki/Nioh
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',95,'2017-11-07',49.99,'https://store.steampowered.com/app/485510/Nioh_Complete_Edition___Complete_Edition/'),
('PS5',95,'2021-02-05',49.99,'https://www.playstation.com/en-us/games/nioh-ps4/'),
('PS4',95,'2017-02-08',49.99,'https://www.playstation.com/en-us/games/nioh-ps4/');

-- 96. Code Vein | wikipedia: https://en.wikipedia.org/wiki/Code_Vein
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',96,'2019-09-27',49.99,'https://store.steampowered.com/app/678960/CODE_VEIN/'),
('PS4',96,'2019-09-27',59.99,'https://www.playstation.com/en-us/games/code-vein-ps4/'),
('XBO',96,'2019-09-27',59.99,'https://www.xbox.com/en-us/games/store/code-vein/c4q7k19q0vbz');

-- 97. Remnant: From the Ashes | wikipedia: https://en.wikipedia.org/wiki/Remnant:_From_the_Ashes
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',97,'2019-08-20',39.99,'https://store.steampowered.com/app/617290/Remnant_From_the_Ashes/'),
('PS4',97,'2019-08-20',39.99,'https://www.playstation.com/en-us/games/remnant-from-the-ashes-ps4/'),
('XBO',97,'2019-08-20',39.99,'https://www.xbox.com/fr-BE/games/store/remnant-from-the-ashes/9PBHXGWZTS2N/0010'),
('NSW',97,'2023-03-21',39.99,'https://www.nintendo.com/games/detail/remnant-from-the-ashes-switch/');

-- 98. Blasphemous | wikipedia: https://en.wikipedia.org/wiki/Blasphemous_(video_game)
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',98,'2019-09-10',24.99,'https://store.steampowered.com/app/774361/Blasphemous/'),
('PS4',98,'2019-09-10',24.99,'https://www.playstation.com/en-us/games/blasphemous-ps4/'),
('XBO',98,'2019-09-10',24.99,'https://www.xbox.com/en-us/games/store/blasphemous/9p0478ztxlz4'),
('NSW',98,'2019-09-10',24.99,'https://www.nintendo.com/games/detail/blasphemous-switch/');

-- 99. Mortal Shell | wikipedia: https://en.wikipedia.org/wiki/Mortal_Shell
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',99,'2020-08-18',29.99,'https://store.steampowered.com/app/1110910/Mortal_Shell/'),
('PS4',99,'2020-08-18',29.99,'https://www.playstation.com/en-us/games/mortal-shell/'),
('XBO',99,'2020-08-18',29.99,'https://www.xbox.com/en-us/games/store/mortal-shell-enhanced-edition/9pc2bjdxr2lk'),
('XSX',99,'2021-03-04',29.99,'https://www.xbox.com/en-us/games/store/mortal-shell-enhanced-edition/9pc2bjdxr2lk'),
('NSW',99,'2022-12-19',29.99,'https://www.nintendo.com/us/store/products/mortal-shell-complete-edition-switch/'),
('PS5',99,'2021-03-04',29.99,'https://www.playstation.com/en-us/games/mortal-shell/');

-- 100. Elden Ring | wikipedia: https://en.wikipedia.org/wiki/Elden_Ring
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',100,'2022-02-25',59.99,'https://store.steampowered.com/app/1245620/ELDEN_RING/'),
('PS5',100,'2022-02-25',59.99,'https://www.playstation.com/en-us/games/elden-ring/'),
('XSX',100,'2022-02-25',59.99,'https://www.xbox.com/en-us/games/store/elden-ring/9p3j32ctxlrz'),
('PS4',100,'2022-02-25',59.99,'https://www.playstation.com/en-us/games/elden-ring/'),
('XBO',100,'2022-02-25',59.99,'https://www.xbox.com/en-us/games/store/elden-ring/9p3j32ctxlrz');

-- 101. Bloons TD 6 | wikipedia: https://en.wikipedia.org/wiki/Bloons_TD_6
INSERT INTO publication (platform_code, video_game_id, release_date, release_price, store_page_url)
VALUES
('PC',101,'2018-12-17',9.99,'https://store.steampowered.com/app/960090/Bloons_TD_6/'),
('MOB',101,'2018-06-13',0,'https://play.google.com/store/apps/details?id=com.ninjakiwi.bloonstd6&hl=en_US&gl=US'),
('XBO',101,'2023-09-05',0,'https://www.xbox.com/en-us/games/store/bloons-td-6/9phkz9xt6f85'),
('XSX',101,'2023-09-05',0,'https://www.xbox.com/en-us/games/store/bloons-td-6/9phkz9xt6f85');
 
-- Jeu 1: Call of Duty: Black Ops Cold War
-- Genre: First-Person Shooter, Action, 
--Multiplayer, War, Espionage/Thriller, Cold War Era
INSERT INTO category(type_id,video_game_id)
VALUES
(17,1),(16,1),(101,1),(60,1),(61,1);
-- Jeu 2: FIFA 21
-- Sports, Soccer
INSERT INTO category(type_id,video_game_id)
VALUES
(69,2),(71,2),(73,2);

-- Jeu 3: The Legend of Zelda: Breath of the Wild
-- Genre: Action-Adventure, Open World, Fantasy
INSERT INTO category(type_id,video_game_id)
VALUES
(53,3),(1,3),(2,3);

-- Jeu 4: Cyberpunk 2077
--Genre: Action Role-Playing Game (RPG), Open World, Cyberpunk
INSERT INTO category(type_id,video_game_id)
VALUES
(1,4),(53,4),(3,4);

-- Jeu 5: Red Dead Redemption 2
--Genre: Action-Adventure, Open World, Western
INSERT INTO category(type_id,video_game_id)
VALUES
(1,5),(54,5),(4,5);

-- Jeu 6: The Witcher 3: Wild Hunt
-- Genres: Action Role-Playing Game (RPG), Open World, Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 6), -- Action Role-Playing Game (RPG)
(1, 6), -- Open World
(2, 6); -- Fantasy

-- Jeu 7: Grand Theft Auto V
-- Genres: Action-Adventure, Open World, Crime
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 7), -- Action-Adventure
(1, 7), -- Open World
(5, 7); -- Crime

-- Jeu 8: Call of Duty: Modern Warfare
-- Genres: First-Person Shooter (FPS), Action, Multiplayer, War
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 8), -- First-Person Shooter (FPS)
(16, 8), -- Action
(101, 8), -- Multiplayer
(60, 8); -- War

-- Jeu 9: Minecraft
-- Genres: Sandbox, Building, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(40, 9), -- Sandbox
(39, 9), -- Building
(1, 9); -- Open World

-- Jeu 10: Assassin's Creed Valhalla
-- Genres: Action-Adventure, Open World, Historical
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 10), -- Action-Adventure
(1, 10), -- Open World
(7, 10); -- Historical

-- Jeu 11: Super Mario Odyssey
-- Genres: Platformer, Adventure
INSERT INTO category (type_id, video_game_id)
VALUES
(76, 11), -- Platformer
(54, 11); -- Adventure

-- Jeu 12: The Elder Scrolls V: Skyrim
-- Genres: Action Role-Playing Game (RPG), Open World, Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 12), -- Action Role-Playing Game (RPG)
(1, 12), -- Open World
(2, 12); -- Fantasy

-- Jeu 13: Sekiro: Shadows Die Twice
-- Genres: Action-Adventure, Action Role-Playing Game (RPG), Feudal Japan
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 13), -- Action-Adventure
(53, 13), -- Action Role-Playing Game (RPG)
(9, 13); -- Feudal Japan

-- Jeu 14: Horizon Zero Dawn
-- Genres: Action-Adventure, Open World, Sci-Fi
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 14), -- Action-Adventure
(1, 14), -- Open World
(95, 14); -- Science Fiction

-- Jeu 15: Doom Eternal
-- Genres: First-Person Shooter (FPS), Action, Science Fiction
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 15), -- First-Person Shooter (FPS)
(16, 15), -- Action
(95, 15); -- Science Fiction

-- Jeu 16: The Last of Us Part II
-- Genres: Action-Adventure, Survival, Post-Apocalyptic
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 16), -- Action-Adventure
(21, 16), -- Survival
(10, 16); -- Post-Apocalyptic

-- Jeu 17: Star Wars Jedi: Fallen Order
-- Genres: Action-Adventure, Star Wars
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 17), -- Action-Adventure
(12, 17); -- Star Wars

-- Jeu 18: Halo: Infinite
-- Genres: First-Person Shooter (FPS), Sci-Fi, Military
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 18), -- First-Person Shooter (FPS)
(95, 18), -- Science Fiction
(50, 18); -- Military

-- Jeu 19: Resident Evil Village
-- Genres: Survival Horror, Action, Zombies
INSERT INTO category (type_id, video_game_id)
VALUES
(21, 19), -- Survival Horror
(16, 19), -- Action
(13, 19); -- Zombies

-- Jeu 20: Ghost of Tsushima
-- Genres: Action-Adventure, Feudal Japan, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 20), -- Action-Adventure
(9, 20), -- Feudal Japan
(1, 20); -- Open World

-- Jeu 21: Final Fantasy VII
-- Genres: Role-Playing (RPG), Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(59, 21), -- Role-Playing (RPG)
(2, 21); -- Fantasy

-- Jeu 22: Death Stranding
-- Genres: Action-Adventure, Sci-Fi, Post-Apocalyptic
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 22), -- Action-Adventure
(95, 22), -- Science Fiction
(10, 22); -- Post-Apocalyptic

-- Jeu 23: Demon's Souls
-- Genres: Action Role-Playing Game (RPG), Fantasy, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 23), -- Action Role-Playing Game (RPG)
(2, 23), -- Fantasy
(8, 23); -- Souls-like

-- Jeu 24: Fallout 4
-- Genres: Action Role-Playing Game (RPG), Open World, Post-Apocalyptic
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 24), -- Action Role-Playing Game (RPG)
(1, 24), -- Open World
(10, 24); -- Post-Apocalyptic

-- Jeu 25: Genshin Impact
-- Genres: Action Role-Playing Game (RPG), Fantasy, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 25), -- Action Role-Playing Game (RPG)
(2, 25), -- Fantasy
(1, 25); -- Open World

-- Jeu 26: Borderlands 3
-- Genres: First-Person Shooter (FPS), Action, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 26), -- First-Person Shooter (FPS)
(16, 26), -- Action
(1, 26); -- Open World

-- Jeu 27: The Outer Worlds
-- Genres: Action Role-Playing Game (RPG), Sci-Fi, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 27), -- Action Role-Playing Game (RPG)
(95, 27), -- Science Fiction
(1, 27); -- Open World

-- Jeu 28: Control
-- Genres: Action-Adventure, Sci-Fi, Supernatural
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 28), -- Action-Adventure
(95, 28), -- Science Fiction
(15, 28); -- Supernatural

-- Jeu 29: The Medium
-- Genres: Psychological Horror, Supernatural
INSERT INTO category (type_id, video_game_id)
VALUES
(93, 29), -- Psychological Horror
(15, 29); -- Supernatural

-- Jeu 30: Nioh 2
-- Genres: Action Role-Playing Game (RPG), Feudal Japan, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 30), -- Action Role-Playing Game (RPG)
(9, 30), -- Feudal Japan
(8, 30); -- Souls-like

-- Jeu 31: Watch Dogs: Legion
-- Genres: Action-Adventure, Open World, Crime, Cyberpunk
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 31), -- Action-Adventure
(1, 31), -- Open World
(5, 31), -- Crime
(3, 31); -- Cyberpunk

-- Jeu 32: Bioshock Infinite
-- Genres: First-Person Shooter (FPS), Action, Sci-Fi
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 32), -- First-Person Shooter (FPS)
(16, 32), -- Action
(95, 32); -- Science Fiction

-- Jeu 33: Dying Light 2: Stay Human
-- Genres: Action-Adventure, Open World, Survival, Zombies
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 33), -- Action-Adventure
(1, 33), -- Open World
(21, 33), -- Survival
(13, 33); -- Zombies

-- Jeu 34: Fall Guys
-- Genres: Party
INSERT INTO category (type_id, video_game_id)
VALUES
(28, 34); -- Party

-- Jeu 35: God of War I
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 35), -- Action-Adventure
(29, 35); -- Mythology

-- Jeu 36: God of War II
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 36), -- Action-Adventure
(29, 36); -- Mythology

-- Jeu 37: God of War: Betrayal
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 37), -- Action-Adventure
(29, 37); -- Mythology

-- Jeu 38: God of War: Chains of Olympus
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 38), -- Action-Adventure
(29, 38); -- Mythology

-- Jeu 39: God of War III
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 39), -- Action-Adventure
(29, 39); -- Mythology

-- Jeu 40: God of War: Ghost of Sparta
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 40), -- Action-Adventure
(29, 40); -- Mythology

-- Jeu 41: God of War: Ascension
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 41), -- Action-Adventure
(29, 41); -- Mythology

-- Jeu 42: God of War 2018
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 42), -- Action-Adventure
(29, 42); -- Mythology

-- Jeu 43: God of War Ragnarok
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 43), -- Action-Adventure
(29, 43); -- Mythology

-- Jeu 44: God of War III Remastered
-- Genres: Action-Adventure, Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(54, 44), -- Action-Adventure
(29, 44); -- Mythology

-- Jeu 45: Stardew Valley
-- Genres: Simulation, Farming, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(30, 45), -- Simulation
(31, 45), -- Farming
(1, 45); -- Open World

-- Jeu 46: Hades
-- Genres: Action Role-Playing Game (RPG), Mythology
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 46), -- Action Role-Playing Game (RPG)
(29, 46); -- Mythology

-- Jeu 47: Baldur's Gate 3
-- Genres: Role-Playing (RPG), Dungeons & Dragons, Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(59, 47), -- Role-Playing (RPG)
(33, 47), -- Dungeons & Dragons
(2, 47); -- Fantasy

-- Jeu 48: Monster Hunter: World
-- Genres: Action, Fantasy, Hunting
INSERT INTO category (type_id, video_game_id)
VALUES
(16, 48), -- Action
(2, 48), -- Fantasy
(34, 48); -- Hunting

-- Jeu 49: Cyber Shadow
-- Genres: Action, Platformer, Ninja
INSERT INTO category (type_id, video_game_id)
VALUES
(16, 49), -- Action
(76, 49), -- Platformer
(95, 49); -- Ninja

-- Jeu 50: Animal Crossing: New Horizons
-- Genres: Simulation, Life Simulation, Open World
INSERT INTO category (type_id, video_game_id)
VALUES
(30, 50), -- Simulation
(80, 50), -- Life Simulation
(1, 50); -- Open World

-- Jeu 51: Tom Clancy's Rainbow Six Siege
-- Genres: Tactical Shooter, Military, Team-Based
INSERT INTO category (type_id, video_game_id)
VALUES
(35, 51), -- Tactical Shooter
(50, 51), -- Military
(42, 51); -- Team-Based

-- Jeu 52: Final Fantasy VII Remake
-- Genres: Action Role-Playing Game (RPG), Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 52), -- Action Role-Playing Game (RPG)
(2, 52); -- Fantasy

-- Jeu 53: League of Legends
-- Genres: Multiplayer Online Battle Arena (MOBA), Fantasy, Competitive Online
INSERT INTO category (type_id, video_game_id)
VALUES
(46, 53), -- Multiplayer Online Battle Arena (MOBA)
(2, 53), -- Fantasy
(96, 53); -- Competitive Online

-- Jeu 54: Apex Legends
-- Genres: First-Person Shooter (FPS), Battle Royale, Team-Based
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 54), -- First-Person Shooter (FPS)
(41, 54), -- Battle Royale
(42, 54); -- Team-Based

-- Jeu 55: Among Us
-- Genres: Social Deduction, Party, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(37, 55), -- Social Deduction
(28, 55), -- Party
(101, 55); -- Multiplayer

-- Jeu 56: Call of Duty: Warzone
-- Genres: First-Person Shooter (FPS), Battle Royale, Military
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 56), -- First-Person Shooter (FPS)
(41, 56), -- Battle Royale
(50, 56); -- Military

-- Jeu 57: Fortnite
-- Genres: Battle Royale, Building, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(41, 57), -- Battle Royale
(39, 57), -- Building
(101, 57); -- Multiplayer

-- Jeu 58: Overwatch
-- Genres: First-Person Shooter (FPS), Team-Based, Hero Shooter
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 58), -- First-Person Shooter (FPS)
(42, 58), -- Team-Based
(24, 58); -- Hero Shooter

-- Jeu 59: Valorant
-- Genres: First-Person Shooter (FPS), Team-Based, Tactical
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 59), -- First-Person Shooter (FPS)
(42, 59), -- Team-Based
(36, 59); -- Tactical

-- Jeu 60: Destiny 2
-- Genres: First-Person Shooter (FPS), Multiplayer, Science Fiction
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 60), -- First-Person Shooter (FPS)
(101, 60), -- Multiplayer
(95, 60); -- Science Fiction

-- Jeu 61: Counter-Strike: Global Offensive
-- Genres: First-Person Shooter (FPS), Team-Based, Tactical
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 61), -- First-Person Shooter (FPS)
(42, 61), -- Team-Based
(36, 61); -- Tactical

-- Jeu 62: Rocket League
-- Genres: Sports, Racing, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(69, 62), -- Sports
(70, 62), -- Racing
(101, 62); -- Multiplayer

-- Jeu 63: Sea of Thieves
-- Genres: Open World, Multiplayer, Pirates
INSERT INTO category (type_id, video_game_id)
VALUES
(1, 63), -- Open World
(101, 63), -- Multiplayer
(44, 63); -- Pirates

-- Jeu 64: World of Warcraft
-- Genres: Massively Multiplayer Online Role-Playing (MMORPG), Fantasy, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(64, 64), -- Massively Multiplayer Online Role-Playing (MMORPG)
(2, 64), -- Fantasy
(101, 64); -- Multiplayer

-- Jeu 65: Dead by Daylight
-- Genres: Horror, Multiplayer, Survival
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 65), -- Horror
(101, 65), -- Multiplayer
(21, 65); -- Survival

-- Jeu 66: Phasmophobia
-- Genres: Horror, Multiplayer, Paranormal
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 66), -- Horror
(101, 66), -- Multiplayer
(48, 66); -- Paranormal

-- Jeu 67: The Sims 4
-- Genres: Life Simulation, Simulation, Sandbox
INSERT INTO category (type_id, video_game_id)
VALUES
(80, 67), -- Life Simulation
(30, 67), -- Simulation
(40, 67); -- Sandbox

-- Jeu 68: Rust
-- Genres: Survival, Open World, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(21, 68), -- Survival
(1, 68), -- Open World
(101, 68); -- Multiplayer

-- Jeu 69: RuneScape
-- Genres: Massively Multiplayer Online Role-Playing (MMORPG), Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(64, 69), -- Massively Multiplayer Online Role-Playing (MMORPG)
(2, 69); -- Fantasy

-- Jeu 70: Path of Exile
-- Genres: Action Role-Playing Game (RPG), Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 70), -- Action Role-Playing Game (RPG)
(2, 70); -- Fantasy

-- Jeu 71: World of Tanks
-- Genres: Military, Multiplayer, Team-Based
INSERT INTO category (type_id, video_game_id)
VALUES
(50, 71), -- Military
(101, 71), -- Multiplayer
(42, 71); -- Team-Based

-- Jeu 72: Warframe
-- Genres: Action, Science Fiction, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(16, 72), -- Action
(95, 72), -- Science Fiction
(101, 72); -- Multiplayer

-- Jeu 73: Team Fortress 2
-- Genres: First-Person Shooter (FPS), Multiplayer, Team-Based
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 73), -- First-Person Shooter (FPS)
(101, 73), -- Multiplayer
(42, 73); -- Team-Based

-- Jeu 74: Dota 2
-- Genres: Multiplayer Online Battle Arena (MOBA), Fantasy, Competitive Online
INSERT INTO category (type_id, video_game_id)
VALUES
(46, 74), -- Multiplayer Online Battle Arena (MOBA)
(2, 74), -- Fantasy
(96, 74); -- Competitive Online

-- Jeu 75: Smite
-- Genres: Multiplayer Online Battle Arena (MOBA), Mythology, Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(46, 75), -- Multiplayer Online Battle Arena (MOBA)
(29, 75), -- Mythology
(2, 75); -- Fantasy

-- Jeu 76: Guild Wars 2
-- Genres: Massively Multiplayer Online Role-Playing (MMORPG), Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(64, 76), -- Massively Multiplayer Online Role-Playing (MMORPG)
(2, 76); -- Fantasy

-- Jeu 77: Arma 3
-- Genres: Military Simulation, Tactical, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(50, 77), -- Military Simulation
(36, 77), -- Tactical
(101, 77); -- Multiplayer

-- Jeu 78: Outlast
-- Genres: Horror, Survival, Psychological Horror
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 78), -- Horror
(21, 78), -- Survival
(93, 78); -- Psychological Horror

-- Jeu 79: The Forest
-- Genres: Survival, Open World, Horror
INSERT INTO category (type_id, video_game_id)
VALUES
(21, 79), -- Survival
(1, 79), -- Open World
(11, 79); -- Horror

-- Jeu 80: Left 4 Dead 2
-- Genres: First-Person Shooter (FPS), Co-op, Zombies
INSERT INTO category (type_id, video_game_id)
VALUES
(17, 80), -- First-Person Shooter (FPS)
(14, 80), -- Co-op
(13, 80); -- Zombies

-- Jeu 81: Among the Sleep
-- Genres: Horror, Psychological Horror, First-Person
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 81), -- Horror
(93, 81), -- Psychological Horror
(17, 81); -- First-Person

-- Jeu 82: Alien: Isolation
-- Genres: Horror, Stealth, Sci-Fi
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 82), -- Horror
(6, 82), -- Stealth
(95, 82); -- Science Fiction

-- Jeu 83: Amnesia: The Dark Descent
-- Genres: Horror, Psychological Horror, First-Person
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 83), -- Horror
(93, 83), -- Psychological Horror
(17, 83); -- First-Person

-- Jeu 84: The Evil Within
-- Genres: Horror, Survival, Third-Person Shooter (TPS)
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 84), -- Horror
(21, 84), -- Survival
(18, 84); -- Third-Person Shooter (TPS)

-- Jeu 85: Dead Space
-- Genres: Horror, Survival, Science Fiction
INSERT INTO category (type_id, video_game_id)
VALUES
(11, 85), -- Horror
(21, 85), -- Survival
(95, 85); -- Science Fiction

-- Jeu 86: Dark Souls
-- Genres: Action Role-Playing Game (RPG), Fantasy, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 86), -- Action Role-Playing Game (RPG)
(2, 86), -- Fantasy
(8, 86); -- Souls-like

-- Jeu 87: Dark Souls II
-- Genres: Action Role-Playing Game (RPG), Fantasy, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 87), -- Action Role-Playing Game (RPG)
(2, 87), -- Fantasy
(8, 87); -- Souls-like

-- Jeu 88: Dark Souls III
-- Genres: Action Role-Playing Game (RPG), Fantasy, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 88), -- Action Role-Playing Game (RPG)
(2, 88), -- Fantasy
(8, 88); -- Souls-like

-- Jeu 89: Bloodborne
-- Genres: Action Role-Playing Game (RPG), Horror, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 89), -- Action Role-Playing Game (RPG)
(11, 89), -- Horror
(8, 89); -- Souls-like

-- Jeu 90: The Surge
-- Genres: Action, Science Fiction, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(16, 90), -- Action
(95, 90), -- Science Fiction
(8, 90); -- Souls-like

-- Jeu 91: Lords of the Fallen
-- Genres: Action Role-Playing Game (RPG), Fantasy, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 91), -- Action Role-Playing Game (RPG)
(2, 91), -- Fantasy
(8, 91); -- Souls-like

-- Jeu 92: Salt and Sanctuary
-- Genres: Action Role-Playing Game (RPG), Metroidvania, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 92), -- Action Role-Playing Game (RPG)
(25, 92), -- Metroidvania
(8, 92); -- Souls-like

-- Jeu 93: Hollow Knight
-- Genres: Metroidvania, Platformer, Exploration
INSERT INTO category (type_id, video_game_id)
VALUES
(25, 93), -- Metroidvania
(76, 93), -- Platformer
(56, 93); -- Exploration

-- Jeu 94: Ashen
-- Genres: Action Role-Playing Game (RPG), Open World, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 94), -- Action Role-Playing Game (RPG)
(1, 94), -- Open World
(8, 94); -- Souls-like

-- Jeu 95: Nioh
-- Genres: Action Role-Playing Game (RPG), Feudal Japan, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 95), -- Action Role-Playing Game (RPG)
(9, 95), -- Feudal Japan
(8, 95); -- Souls-like

-- Jeu 96: Remnant: From the Ashes
-- Genres: Action, Co-op, Post-Apocalyptic
INSERT INTO category (type_id, video_game_id)
VALUES
(16, 96), -- Action
(14, 96), -- Co-op
(10, 96); -- Post-Apocalyptic

-- Jeu 97: Blasphemous
-- Genres: Action, Metroidvania, Dark Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(16, 97), -- Action
(25, 97), -- Metroidvania
(53, 97); -- Dark Fantasy

-- Jeu 98: Code Vein
-- Genres: Action Role-Playing Game (RPG), Anime, Post-Apocalyptic
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 98), -- Action Role-Playing Game (RPG)
(56, 98), -- Anime
(10, 98); -- Post-Apocalyptic

-- Jeu 99: Mortal Shell
-- Genres: Action Role-Playing Game (RPG), Souls-like, Dark Fantasy
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 99), -- Action Role-Playing Game (RPG)
(8, 99), -- Souls-like
(53, 99); -- Dark Fantasy

-- Jeu 100: Elden Ring
-- Genres: Action Role-Playing Game (RPG), Open World, Dark Fantasy, Souls-like
INSERT INTO category (type_id, video_game_id)
VALUES
(53, 100), -- Action Role-Playing Game (RPG)
(1, 100), -- Open World
(53, 100), -- Dark Fantasy
(8, 100); -- Souls-like

-- Jeu 101: Bloons TD 6
-- Genres: Tower Defense, Strategy, Multiplayer
INSERT INTO category (type_id, video_game_id)
VALUES
(38, 101), -- Tower Defense
(32, 101), -- Strategy
(101, 101); -- Multiplayer


-- INSERT INTO game (user_id, publication_id, is_owned, review_rating, review_comment, review_date) VALUES (1, 1, TRUE, 5, 'Great game!', '2021-01-01');
-- INSERT INTO game (user_id, publication_id, is_owned, review_rating, review_comment, review_date) VALUES (1, 2, TRUE, 4, 'Good game!', '2021-01-01');
-- INSERT INTO game (user_id, publication_id, is_owned, review_rating, review_comment, review_date) VALUES (1, 3, TRUE, 3, 'Ok game!', '2021-01-01');
-- INSERT INTO game (user_id, publication_id, is_owned, review_rating, review_comment, review_date) VALUES (1, 4, TRUE, 2, 'Bad game!', '2021-01-01');



