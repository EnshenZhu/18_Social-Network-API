const { User, Thought } = require('../models');

const userController = {
    // get all users.
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })        
        .select('-__v')
        .sort({_id: -1})
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // get one user by id.
    getUserById({ params }, res) {
        User.findOne({_id: params.id })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // create a user.
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    //update user by id.
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'The user with this id cannot be found!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err))
    },

    //delete a user
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'The user with this id cannot be found!'});
                return;
            }
            return dbUserData;
        })
        .then( async dbUserData => {
            await Thought.deleteMany({username: dbUserData._id})
            await User.updateMany({
                _id: {
                    $in: dbUserData.friends
                }
            }, 
            {
                $pull: {
                    friends: params.userId
                }
            })
            res.json({message: "Both user and the related thoughts are deleted!"})
        })
        .catch(err => {
            res.status(400).json(err);
        })
    },

    //add a friend to user by id.
    addFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.id }, {$push: { friends: params.friendId }}, {new: true})
        .populate({
            path: 'friends',
            select: ('-__v')
        })
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'The user with this id cannot be found!'});
                return;
            }
        res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },

    //delete a friend from user by id.
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId }}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'The friend with this id cannot be found!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = userController;