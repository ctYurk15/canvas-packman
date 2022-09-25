class Texturer
{
    constructor(powerup_textures, ghost_textures)
    {
        this.powerup_textures = powerup_textures;
        this.ghost_textures = ghost_textures;
    }

    getPowerupTexture()
    {
        return this.getRandomTexture(this.powerup_textures);
    }

    getGhostTexture()
    {
        return this.getRandomTexture(this.ghost_textures);
    }

    getRandomTexture(textures)
    {
        let index = parseInt(Math.random()*textures.length);
        return textures[index];
    }
}