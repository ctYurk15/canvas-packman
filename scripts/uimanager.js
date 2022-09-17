class UIManager
{
    constructor(scores_text, scores_container, menu_modal, game_over_container, game_over_scores)
    {
        this.scores_text = scores_text;
        this.scores_container = scores_container;
        this.menu_modal = menu_modal;
        this.game_over_container = game_over_container;
        this.game_over_scores = game_over_scores;
    }

    updateScores(scores_amount)
    {
        this.scores_text.innerHTML = scores_amount;
    }

    death(scores_amount)
    {
        this.game_over_container.classList.remove('hidden');
        this.menu_modal.classList.remove('hidden');
        this.scores_container.classList.add('hidden');
        this.game_over_scores.innerHTML = scores_amount;
    }
}