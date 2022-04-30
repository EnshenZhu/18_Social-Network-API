const { Thought, User } = require('../models');

const thoughtController = {

    //get all thoughts.
    getAllThoughts(req,res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    //get a thought by id.
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
            res.status(404).json({message: 'No thoughts has been found with this id!'});
            return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

     //create a thought for an user.
     createThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No users found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    //update a thought by id.
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-___v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thoughts found with this id!'});
                return;
            }
                res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    //delete a current thought by ID.
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id: params.id})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thoughts found with this id!'});
                return;
            }
            res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    //add a new reaction.
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(404).json({message: 'No thoughts found with this id!'});
            return;
        }
        res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))

    },

    //delete a reaction by ID.
    deleteReaction({params}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No reactions found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    }
};

//Export module thought controller.
module.exports = thoughtController;