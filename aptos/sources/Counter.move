module counter_app::Counter {
    use std::signer;

    struct Count has key {
        count: u64
    }

    const E_NOT_INITIALISED: u64 = 1;
    const E_UNDERFLOW: u64 = 2;

    /// Initializes a counter with a count of 0 if it does not exist
    public entry fun create_counter(account: &signer) {
        let account_address = signer::address_of(account);

        if (!exists<Count>(account_address)) {
            move_to(account, Count { count: 0 });
        }
    }

    /// Increases the count by 1
    public entry fun increase_c(account: &signer) acquires Count {
        let signer_add = signer::address_of(account);
        assert!(exists<Count>(signer_add), E_NOT_INITIALISED);
        let number_p = borrow_global_mut<Count>(signer_add);
        number_p.count = number_p.count + 1;
    }

    /// Decreases the count by 1, if the count is greater than 0
    public entry fun decrease_c(account: &signer) acquires Count {
        let signer_add = signer::address_of(account);
        assert!(exists<Count>(signer_add), E_NOT_INITIALISED);
        let number_p = borrow_global_mut<Count>(signer_add);
        
        // Ensure there is no underflow
        assert!(number_p.count > 0, E_UNDERFLOW);
        
        number_p.count = number_p.count - 1;
    }
}
