import RAPIER from '@dimforge/rapier2d-compat';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    async create ()
    {
        // Initialization: We use await RAPIER.init() to initialize Rapier. Then, we create a new Rapier world with a gravity in this example we use 9.81
        await RAPIER.init();

        this.rapierWorld = new RAPIER.World(new RAPIER.Vector2(0.0, 9.81));

        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        // We create a phaser game object and a Rapier rigid body with a collider
        const logo = this.add.image(512, 100, 'logo');

        // We create a Rapier rigid body with a collider
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic();
        rigidBodyDesc.setTranslation(logo.x, logo.y);

        // This step is important we need store the phaser game object in the rigid body user data to update the game object position and rotation.
        rigidBodyDesc.setUserData(logo);
        
        // We create a Rapier rigid body with a collider
        const rigidBody = this.rapierWorld.createRigidBody(rigidBodyDesc);

        // We create a ColliderDesc with a cuboid shape and set the restitution to 0.7
        const colliderDesc = RAPIER.ColliderDesc.cuboid(logo.displayWidth / 2, logo.displayHeight / 2);

        colliderDesc.setRestitution(0.7);

        // Finally, we create a collider with the colliderDesc and the rigid body
        this.rapierWorld.createCollider(colliderDesc, rigidBody);   

        const text = this.add.text(512, 584, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        //  Add physics to the Text
        const rigidBodyDesc2 = RAPIER.RigidBodyDesc.fixed();

        rigidBodyDesc2.setTranslation(text.x, text.y);
        rigidBodyDesc2.setUserData(text);

        const rigidBody2 = this.rapierWorld.createRigidBody(rigidBodyDesc2);
        const colliderDesc2 = RAPIER.ColliderDesc.cuboid(text.displayWidth / 2, text.displayHeight / 2);

        this.rapierWorld.createCollider(colliderDesc2, rigidBody2);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update ()
    {
        // We need to check if the Rapier world is initialized
        if (this.rapierWorld !== undefined)
        {
            // Step the physics world
            this.rapierWorld.step();

            // Update the Phaser game objects with the physics world
            this.rapierWorld.bodies.forEach((rigidBody) => {

                const gameObject = rigidBody.userData;

                if (gameObject)
                {
                    const position = rigidBody.translation();
                    const angle = rigidBody.rotation();
                    gameObject.x = position.x;
                    gameObject.y = position.y;
                    gameObject.setRotation(angle);
                }
            });
        }
    }
}
